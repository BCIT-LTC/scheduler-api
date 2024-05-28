const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const createLogger = require('../logger');
const logger = createLogger(module);
const { userModel } = require("../models/userModel");

const userRoleValidation = [
    body('roles')
        // Check if roles is an array with at least one role
        .isArray({min: 1}).withMessage('Roles must be an array with at least one role')
        // Check if all roles are strings
        .custom(roles => roles.every(role => typeof role === 'string'))
];

/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       required:
 *         - user_id
 *         - email
 *         - first_name
 *         - last_name
 *         - saml_role
 *         - app_roles
 *         - department
 *         - is_active
 *       properties:
 *         user_id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         first_name:
 *           type: string
 *           description: The first name of the user
 *         last_name:
 *           type: string
 *           description: The last name of the user
 *         saml_role:
 *           type: string
 *           description: The SAML role of the user
 *         app_roles:
 *           type: array
 *           items:
 *             type: string
 *           description: The application roles of the user
 *         department:
 *           type: string
 *           description: The department of the user
 *         is_active:
 *           type: boolean
 *           description: The status of the user
 *       example:
 *         user_id: 1
 *         email: example@example.com
 *         first_name: John
 *         last_name: Doe
 *         saml_role: student
 *         app_roles: [role1]
 *         department: Test Department
 *         is_active: true
 *
 * tags:
 *   name: users
 *   description: The users managing API, JWT authentication is required to access this endpoint.
 * /api/users:
 *   get:
 *     summary: Retrieve the users
 *     tags: [users]
 *     responses:
 *       200:
 *         description: The list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Some server error
 *
 * /api/user/{user_id}:
 *   patch:
 *     summary: Update the user role
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user role has been updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   description: The auto-generated id of the user
 *                 role:
 *                   type: string
 *                   description: The role of the user
 *       500:
 *         description: Some server error
 */

/**
 * GET endpoint to retrieve all users.
 */
router.get('/users', async (req, res) => {
    try {
        const users = await userModel.listAllUsers();
        if (!users) {
            logger.error("No users found");
            return res.status(404).send("No users found");
        }
        res.status(200).json(users);
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`);
        res.status(500).send('Error fetching users');
    }
});

/**
 * PATCH api/user/:user_id
 * Updates the user's app_roles field with new roles
 */
router.patch('/user/:user_id', userRoleValidation, async (req, res) => {
    const { user_id } = req.params;
    const { roles } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Update the user role
        const updatedUser = await userModel.updateUserRole(parseInt(user_id, 10), roles);
        return res.status(200).json(updatedUser);
    } catch (error) {
        logger.error({
            message: `PATCH /api/user/${user_id}`,
            error: error.stack
        });
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
