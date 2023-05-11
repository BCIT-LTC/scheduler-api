const {
    authenticateToken,
} = require("../middleware/checkAuth");
const { saveLogoutTime, logoutTime } = require("../models/logoutTime");
const passport = require("../middleware/passport");
const express = require("express");
const router = express.Router();
const jwtDecode = require('jwt-decode');
const userModel = require("../models/userModel").userModel;

router.get("/api/login", async (req, res) => {
    let jwt = req.headers.authorization.split(' ')[1];
    if (!jwt) {
        return;
    }
    let user = jwtDecode(jwt);
    await userModel.addUser(user.email, user.firstname, user.lastname, false, user.eligibleAdmin);
    let details = await userModel.findOne(user.email);
    return res.status(200).send(details.isAdmin);
});

router.post("/api/logouttime", async (req, res) => {
    const getLogoutTime = await logoutTime(req.body.email)
    return res.status(200).send(getLogoutTime)
});

router.get("/api/admin", async (req, res) => {
    return res.status(200).send(await userModel.findAdmins());
});

router.post("/api/admin", async (req, res) => {
    let admin = req.body;
    if (!admin.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).send({ error: "Must be a valid email" });
    }
    let exist = await userModel.findOne(admin.email);
    let response = await userModel.updateAdmin(admin.email, admin.isAdmin);
    if (response) {
        return res.status(400).send({ error: response });
    }
    if (exist == null || exist.firstName === 'N/A') {
        return res.status(200).send({ error: "User has never logged in!" });
    } else {
        return res.status(200).send({ error: '' });
    }
});
module.exports = router;

