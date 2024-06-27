// authorization_check.js
const logger = require("../logger")(module);

// Middleware function to check authorized roles
const authorization_check = (roles) => {
    return (req, res, next) => {
        try {
            // Check if user has any of the authorized roles
            const userToAuthorize = res.locals.user; // Assuming roles are stored in req.user.roles
            // logger.debug("User roles: " + userToAuthorize.app_roles);
            // Check if user has any of the authorized roles
            const isAuthorized = userToAuthorize.app_roles.some((role) => roles.includes(role));

            if (isAuthorized) {
                // User has an authorized role, proceed to the next middleware
                next();
            } else {
                // User does not have an authorized role, send a forbidden response
                res.status(403).json({ error: 'Forbidden' });
            }
        } catch (error) {
            logger.error("Error in authorization_check: " + error);
            res.status(403).json({ error: 'Forbidden' });
        }
    };
};

module.exports = authorization_check;