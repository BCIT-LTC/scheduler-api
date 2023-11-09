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
const userModel = require("../models/userModel").userModel;
const auth = require("../middleware/checkAuth");
const createLogger = require('../logger'); // Ensure the path is correct
const logger = createLogger(module);


/**
 * POST endpoint to authorize a user
 * JWT token is used to decode user data and then either add or update the user in the database.
 */
router.post("/authorize", async (req, res) => {
    try {
        console.log("res.locals.user")
        console.log(res.locals.user)

        // TEMPORARY
        // sample user data for testing
        // set all instructors to admin
        // students accounts stay the same
        let userToAuthorize = res.locals.user;

        // If the user is an instructor, set their role to admin
        if (userToAuthorize.role === 'instructor') {
            userToAuthorize = {
                ...userToAuthorize,
                email: 'admin@bcit.ca',
                first_name: 'admin_firstname',
                last_name: 'admin_lastname',
                role: 'admin',
                school: 'School of Health Sciences',
                program: 'Bachelor of Science in Nursing',
                // isActive should be set based on your application's logic
                isActive: true,
            };
        }

        // Add or update user in the database
        await userModel.addUser(
            userToAuthorize.email,
            userToAuthorize.first_name,
            userToAuthorize.last_name,
            userToAuthorize.role,
            userToAuthorize.school,
            userToAuthorize.program,
            userToAuthorize.isActive,
        );

        // Retrieve the details of the authorized user
        let userDetails = await userModel.findOne(userToAuthorize.email);

        // Send back the user details
        return res.status(200).send(userDetails);
    } catch (error) {
        logger.error({message:"Error in /api/authorize", error: error.stack});
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
        logger.error({message:"/api/logouttime", error: error.stack});
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
        logger.error({message:'/api/admin', error: error.stack});
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
        logger.error({message:'/api/admin POST', error: error.stack});
        return res.status(500).send({ error: error.message });
    }
});
module.exports = router;
