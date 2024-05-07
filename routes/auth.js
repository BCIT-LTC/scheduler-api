const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel").userModel;
const { Role } = require("@prisma/client");

const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);

/**
 * POST endpoint to authorize a user
 * JWT token is used to decode user data and then either add or update the user in the database.
 */
router.post("/authorize", async (req, res) => {
  try {
    console.log("res.locals.user");
    console.log(res.locals.user);

    let userToAuthorize = res.locals.user;

    let user = await userModel.findOne(userToAuthorize.email);

    if (user !== null) {
      let saml_role = Role[userToAuthorize.saml_role]

      if(saml_role === undefined){
        return res.status(400).send({ error: "Unknown user role" });
      }
      
      let app_roles_array = user.app_roles
      if (!user.app_roles.includes(saml_role)) {
        app_roles_array.push(saml_role);
      }
      
      // the addUser method upserts users (updates them here)
      await userModel.addUser(
        userToAuthorize.email,
        userToAuthorize.first_name,
        userToAuthorize.last_name,
        userToAuthorize.saml_role,
        app_roles_array,
        userToAuthorize.department
      );

    }
    else {
      // Add new user to DB
      await userModel.addUser(
        userToAuthorize.email,
        userToAuthorize.first_name,
        userToAuthorize.last_name,
        userToAuthorize.saml_role,
        [userToAuthorize.saml_role], //copy saml_role to the app_roles array
        userToAuthorize.department
      );
    }

    // Retrieve the details of the authorized user
    let userDetails = await userModel.findOne(userToAuthorize.email);
    console.log("userDetails");
    console.log(userDetails);

    if (userDetails !== null) {
      // Send back the user details
      return res.status(200).json(userDetails);
    } else {
      return res.status(400).send({ error: "Unknown user role" });
    }
  } catch (error) {
    logger.error({ message: "Error in /api/authorize", error: error.stack });
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
