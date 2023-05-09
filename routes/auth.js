const {
    authenticateToken,
} = require("../middleware/checkAuth");
const { saveLogoutTime, logoutTime } = require("../models/logoutTime");
const passport = require("../middleware/passport");
const express = require("express");
const router = express.Router();
const jwtDecode = require('jwt-decode');



router.get("/api/login", async (req, res) => {
    let jwt = req.headers.authorization.split(' ')[1];
    if (!jwt) {
        return;
    }
    let user = jwtDecode(jwt);
    console.log(user.email);
    return res.status(200).send(true);
});

router.post("/api/logouttime", async (req, res) => {
    const getLogoutTime = await logoutTime(req.body.email)
    return res.status(200).send(getLogoutTime)
});

module.exports = router;

