const jwt = require("jsonwebtoken");
module.exports = {
    /**
     * Read the token from the authentication header and verify that the user is legit.
     * @param {*} req - the request information from the auth
     * @param {*} requireAdmin - if the token should only be from an admin
     * @returns boolean of authenticity
     */
    authenticateToken: function (req, requireAdmin) {
        if (!req.headers.authorization) return false;
        let token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return false;
        }
        let shouldReject = false;
        jwt.verify(token, process.env.JWT_AUTH_SIGNING_KEY, function (err, decode) {
            if (err) {
                shouldReject = true;
            }
            if (requireAdmin && decode.isAdmin == false) {
                shouldReject = true;
            }
        });
        if (shouldReject) {
            return false;
        }
        return true;
    },
};