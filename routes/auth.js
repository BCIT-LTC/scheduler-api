const {
    authenticateToken,
} = require("../middleware/checkAuth");
const { saveLogoutTime, logoutTime } = require("../models/logoutTime");
const passport = require("../middleware/passport");
const jwt = require("jsonwebtoken");
const path = require("path");
const express = require("express");
const router = express.Router();

function getUserToken(email) {
    return jwt.sign({ email }, process.env.SECRET_KEY);
}

// logout function
router.post('/api/logout', function (req, res, next) {
    saveLogoutTime(req.body.email, req.body.logoutTime);
    res.status(200).send();

    req.logout(function (err) {
        if (err) return next(err);
        res.redirect("/login");
    });
});

router.post(
    "/api/login",
    passport.authenticate("local", {
        failureMessage: true,
    }),
    (req, res) => {
        console.log("req user", req.user, req.authInfo, req.params);
        const token = getUserToken(req.user.email);
        res
            .status(200)
            .json({ token, email: req.user.email, isAdmin: req.user.isAdmin });
        res.end();
    },
    (req, res) => {
        const logoutTime = logoutTime(req.user.email);
    }
);

router.post("/api/logouttime", async (req, res) => {
    const getLogoutTime = await logoutTime(req.body.email)
    return res.status(200).send(getLogoutTime)
});

module.exports = router;

