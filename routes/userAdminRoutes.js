const express = require('express');
const router = express.Router();
const { userModel } = require('../models/userModel');
const auth = require("../middleware/checkAuth");
const fs = require("fs");

/**
 * Function to log errors based on the environment.
 *
 * @param {string} context - Context or source of the error.
 * @param {Error} error - The error object.
 * @returns {void}
 * @async
 */
function logError(context, error) {
    const errorMessage = `${new Date()} - Error in ${context}: ${error.message}\n`;
    if (process.env.Node_ENV === "development") {
        fs.appendFileSync("error_log.txt", errorMessage);
    } else {
        console.error(error);
    }
}

/**
 * Route for updating a user's admin status.
 *
 * @name PATCH /api/admin/updateAdmin/:email
 * @param {string} email - The email of the user to update.
 * @param {boolean} isAdmin - The new admin status of the user.
 * @returns {object} - A message indicating whether the update was successful.
 * @async
 */
router.patch('/updateAdmin/:email', async (req, res) => {
    if (!auth.authenticateToken(req, true)){
        return res.sendStatus(403);
    }
    try {
        const { email } = req.params;
        const { isAdmin } = req.body; // The request's body will contain the new admin status
        if (typeof isAdmin !== 'boolean') {
            return res.status(400).json({ message: 'Invalid admin status. Must be a boolean value.' });
        }
        await userModel.updateAdmin(email, isAdmin);
        res.status(200).json({ message: 'User admin status updated successfully.' });
    } catch (error) {
        logError('Error updating user admin status', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
