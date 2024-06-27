const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel").userModel;
const { App_Role } = require("@prisma/client");
const logger = require("../logger")(module);

/**
 * POST endpoint to authorize a user
 * JWT token is used to decode user data and then either add or update the user in the database.
 */
router.post("/authorize", async (req, res) => {
  try {
    let userToAuthorize = res.locals.user;
    let user = await userModel.findOne(userToAuthorize.email);

    if (userToAuthorize.saml_role === "student") {
      logger.error("Students not allowed to register");
      return res.status(400).send({ error: "Students not allowed to register" });
    }

    if (user !== null) {
      // let saml_role = App_Role[userToAuthorize.saml_role]

      // let app_roles_array = user.app_roles
      // if (!user.app_roles.includes(saml_role)) {
      //   app_roles_array.push(saml_role);
      // }

      // the addUser method upserts users (updates them here)
      await userModel.addUser(
        userToAuthorize.email,
        userToAuthorize.first_name,
        userToAuthorize.last_name,
        userToAuthorize.saml_role,
        user.app_roles, // keep the previous roles
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
        [App_Role.guest], //every new user is a guest at first
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
