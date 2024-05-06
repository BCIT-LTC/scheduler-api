const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel").userModel;
const auth = require("../middleware/authentication_check");
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
      if (user.app_role !== "admin") {
        userToAuthorize.app_role = user.saml_role;

        // synchronize all SAML fields on db with received info: email, first_name, last_name, saml_role, school, program
        if (
          user.email !== userToAuthorize.email ||
          user.first_name !== userToAuthorize.first_name ||
          user.last_name !== userToAuthorize.last_name ||
          user.saml_role !== userToAuthorize.saml_role ||
          user.app_role !== userToAuthorize.saml_role ||
          user.school !== userToAuthorize.school ||
          user.program !== userToAuthorize.program
        ) {
          // the addUser method upserts users (updates them here)
          await userModel.addUser(
            userToAuthorize.email,
            userToAuthorize.first_name,
            userToAuthorize.last_name,
            userToAuthorize.saml_role,
            userToAuthorize.saml_role,
            userToAuthorize.school,
            userToAuthorize.program
          );
        }
      }
      // need condition to update user if they are an admin
      else {
        // if user is an admin, update the admin user with recieved saml fields in the database
        await userModel.addUser(
          user.email,
          userToAuthorize.first_name,
          userToAuthorize.last_name,
          userToAuthorize.saml_role,
          user.app_role,
          userToAuthorize.school,
          userToAuthorize.program
        );
      }
    } else {
      // Add non-admin user to the database
      await userModel.addUser(
        userToAuthorize.email,
        userToAuthorize.first_name,
        userToAuthorize.last_name,
        userToAuthorize.saml_role,

        // the saml_role below is used to set app_role = saml_role
        userToAuthorize.saml_role,
        userToAuthorize.school,
        userToAuthorize.program,
        true // is_active
      );
    }

    // Retrieve the details of the authorized user
    let userDetails = await userModel.findOne(userToAuthorize.email);

    if (userDetails !== null) {
      // Send back the user details
      return res.status(200).json(userDetails);
    } else {
      return res.status(400).send({ error: "Unidentifiable user" });
    }
  } catch (error) {
    logger.error({ message: "Error in /api/authorize", error: error.stack });
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
