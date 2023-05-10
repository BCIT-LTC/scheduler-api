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
    return res.status(200).send(await userModel.findEligable());
});

router.post("/api/admin", async (req, res) => {
    let admins = req.body.admins;
    let isAdmins = [];
    let isntAdmins = [];
    admins.forEach(admin => {
        if (admin.isAdmin === true) {
            isAdmins.push(admin.email);
        } else {
            isntAdmins.push(admin.email);
        }
    });
    userModel.updateAdmin(isAdmins, true);
    userModel.updateAdmin(isntAdmins, false);
    res.sendStatus(200);
});
module.exports = router;

