const jwt = require("jsonwebtoken");
const fs = require('fs');

/**
 * Log an error to the console or to a file depending on the environment.
 * @param error
 */
function logError(error) {
    const errorMessage = `${new Date()} - ${error}\n`;
    if (process.env.Node_ENV === 'development') {
        fs.appendFileSync('error_log.txt', errorMessage);
    } else {
        console.error(error);
    }
}

module.exports = {
    /**
     * Read the token from the authentication header and verify that the user is legit.
     * Based on the user role
     * @param {*} req - the request information from the auth
     * @param {*} requireAdmin - if the token should only be from an admin
     * @returns boolean of authenticity
     */
    authenticateToken: function (req, requireAdmin) {
        if (!req.headers.authorization) {
            logError('Authorization header missing.')
            return false;
        }

        let token = req.headers.authorization.split(" ")[1];
        if (!token) {
            logError('Token missing from Authorization header.')
            return false;
        }
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            if (requireAdmin && !decoded.isAdmin) {
                logError('Admin privileges required but not provided in the token.');
                return false;
            }

            return true;
        } catch (err) {
            logError(`Token verification failed: ${err.message}`);
            return false;
        }
    },
};
