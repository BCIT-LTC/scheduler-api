const express = require('express');
const router = express.Router();
const { App_Role } = require("@prisma/client");
const permission_check = require('../middleware/permission_check');
const logger = require("../logger")(module);

/**
 * GET endpoint to retrieve all roles
 */
router.get('/roles', 
    permission_check(['admin']),
    async (req, res) => {
    try {
        const roles = Object.values(App_Role);
        if (!roles) {
            logger.error("No roles found");
            return res.status(404).send("No roles found");
        }
        res.status(200).json(roles);
    } catch (error) {
        logger.error(`Error getting roles: ${error.message}`);
        res.status(500).send('Error getting roles');
    }
});

module.exports = router;