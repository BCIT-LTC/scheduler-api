const express = require("express");
const router = express.Router();
const { userModel } = require("../models/userModel");
const auth = require("../middleware/authentication_check");
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);

/**
 * Route for updating a user's admin status.
 * The request body should contain the new role that the admin wants to set for the user.
 * The endpoint will then check if the requester is an admin.
 * The endpoint will then perform the action based on the role provided.
 *
 * @name PATCH /api/admin/updateAdmin/:email
 * @param {string} email - The email of the user to update.
 * @param {boolean} isAdmin - The new admin status of the user.
 * @returns {object} - A message indicating whether the update was successful.
 * @async
 */
router.patch("/updateRole/:email", async (req, res) => {
  if (!auth.authentication_check(req, true)) {
    return res.sendStatus(403);
  }
  try {
    const { email } = req.params;
    const { role } = req.body; // The request's body will contain the new role

    // Validate the desired role
    if (role !== "admin" && role !== "user") {
      // Add any other roles your system has
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Check if the requesting user is an admin
    // This shouldn't be necessary if only admins can access this endpoint
    // Still in place just in case
    const requesterEmail = req.user.email; // Assuming the email is stored in req.user
    const requester = await userModel.findOne(requesterEmail);
    if (requester.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update roles." });
    }

    // Update the user's role
    await userModel.updateUserRole(email, role);
    res
      .status(200)
      .json({ message: `User's role updated to ${role} successfully.` });
  } catch (error) {
    logger.error({ message: "Error updating user role", error: error.stack });
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
