const jwt = require("jsonwebtoken");

module.exports = {
    authenticateToken: function (req, requireAdmin) {
        if (!req.headers.authorization) return false;
        let token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return false;
        }
        let shouldReject = false;
        jwt.verify(token, process.env.SECRET_KEY, function (err, decode) {
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

//email, firstname, lastname, isAdmin
