/**
 * @swagger
 * tags:
 *   name: login
 *   description: endpoints of managing login
 * /api/login:
 *   get:
 *     summary: Creates user the the API database using JWT info (email, firstname, lastname, eligibleAdmin)
 *     tags: [login]
 *     responses:
 *       200:
 *         description: User created or updated successfully. Returns true if they are admin.
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * tags:
 *   name: admin
 *   description: endpoints for managing admins
 * /api/admin:
 *   get:
 *     summary: Get a list of the current admins
 *     tags: [admin]
 *     responses:
 *       200:
 *         description: List successfully found and returned
 *       500:
 *         description: Some server error
 *   post:
 *     summary: Update if a user is an admin or not
 *     tags: [admin]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        required: true
 *        name: email
 *        type: string
 *      - in: body
 *        required: true
 *        name: isAdmin
 *        type: boolean
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       500:
 *         description: Some server error
 */
const express = require("express");
const router = express.Router();
const jwtDecode = require("jwt-decode");
const userModel = require("../models/userModel").userModel;
const auth = require("../middleware/checkAuth");
const fs = require("fs");

/**
 * Function to log errors based on the running environment.
 * @param {string} context - The location or function where the error occurred.
 * @param {Error} error - The error that occurred.
 */
const logError = (context, error) => {
    const errorMessage = `${new Date()} - Error in ${context}: ${error.message}\n`;
    if (process.env.Node_ENV === "development") {
        fs.appendFileSync("error_log.txt", errorMessage);
    } else {
        console.error(error);
    }
}

/**
 * POST endpoint to log a user in.
 * JWT token is used to decode user data and then either add or update the user in the database.
 */
router.get("/authorize", async (req, res) => {
    try {
        // Extract JWT from headers and decode user information
        let jwt = req.headers.authorization.split(" ")[1];
        if (!jwt) {
            return res.status(400).send({ error: "Token missing from Authorization header or is invalid." });
        }
        let user = jwtDecode(jwt);

        console.log(user)

        let usernew =
        {
            email: 'admin@bcit.ca',
            first_name: 'admin_firstname',
            last_name: 'admin_lastname',
            role: 'admin',
            school: 'School of Health Sciences',
            program: 'Bachelor of Science in Nursing',
        }
        
        // Add or update user in the database
        // await userModel.addUser(
        //     user.email,
        //     user.firstname,
        //     user.lastname,
        //     false,
        //     user.eligibleAdmin
        // );
        // let details = await userModel.findOne(user.email);
        // return res.status(500).send(user);
        return res.status(200).send(usernew);
    } catch (error) {
        logError("/api/authorize", error);
        return res.status(500).send({ error: error.message });
    }
});

//no swagger yet
/**
 * POST endpoint to get the logout time for a user.
 * Currently, the actual logic behind `logoutTime` is missing in the provided code.
 */
router.post("/logouttime", async (req, res) => {
    try {
        if (!auth.authenticateToken(req, false)) return res.sendStatus(403);
        const getLogoutTime = await logoutTime(req.body.email);
        return res.status(200).send(getLogoutTime);
    } catch (error) {
        logError("/api/logouttime", error);
        return res.status(500).send({ error: error.message });
    }
});

/**
 * GET endpoint to fetch all the admins from the system.
 */
router.get("/admin", async (req, res) => {
    try {
        if (!auth.authenticateToken(req, true)) return res.sendStatus(403);
        return res.status(200).send(userModel.findAdmins());
    } catch (error) {
        logError('/api/admin', error);
        return res.status(500).send({ error: error.message });
    }
});

/**
 * POST endpoint to update the admin status of a user.
 * Admin status can be either granted or revoked based on the provided data.
 */
router.post("/admin", async (req, res) => {
    try {
        if (!auth.authenticateToken(req, true)) return res.sendStatus(403);

        const { email, isAdmin } = req.body;

        // Validate email format
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).send({ error: "Must be a valid email" });
        }

        const existingUser = await userModel.findOne(email);
        const response = await userModel.updateAdmin(email, isAdmin);

        if (response) {
            return res.status(400).send({ error: response });
        }

        if (!existingUser || existingUser.firstName === "N/A") {
            return res.status(200).send({ error: "User has never logged in!" });
        } else {
            return res.status(200).send({ error: "" });
        }
    } catch (error) {
        logError('/api/admin POST', error);
        return res.status(500).send({ error: error.message });
    }
});
module.exports = router;
