const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const createLogger = require('../logger');
const logger = createLogger(module);
const { userModel } = require("../models/userModel");

const userRoleValidation = [
    body('app_roles')
        // Check if roles is an array with at least one role
        .isArray({min: 1}).withMessage('app_roles must be an array with at least one role')
        // Check if all roles are strings
        .custom(roles => roles.every(role => typeof role === 'string'))
];

/**
 * @swagger
 * tags:
 *   name: users
 *   description: API endpoints for user management
 *
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [users]
 *     responses:
 *       200:
 *         description: A list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found
 *       500:
 *         description: Error fetching users
 *
 * /user/{user_id}:
 *   patch:
 *     summary: Update a user's roles
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of roles to assign to the user
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error updating user
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user's ID
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email address
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: The roles assigned to the user
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: johndoe@example.com
 *         roles: ["admin", "user"]
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
    const { app_roles } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Update the user role
        const updatedUser = await userModel.updateUserRole(parseInt(user_id, 10), app_roles);
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
