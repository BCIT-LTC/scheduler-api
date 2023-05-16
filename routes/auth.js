/**
 * @swagger
 * tags:
 *   name: login
 *   description: endpoints of managing login
 * /api/login:
 *   get:
 *     summary: Creates user the the API database using JWT info (email, firstname, lastname, elidgibleAdmin)
 *     tags: [login]
 *     responses:
 *       200:
 *         description: User created or updated successfully. Returns true if they are admin.
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * tags:
 *   name: admin
 *   description: endpoints for managing admins
 * /api/admin:
 *   get:
 *     summary: Get a list of the current admins
 *     tags: [admin]
 *     responses:
 *       200:
 *         description: List successfully found and returned
 *       500:
 *         description: Some server error
 *   post:
 *     summary: Update if a user is an admin or not
 *     tags: [admin]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        required: true
 *        name: email
 *        type: string
 *      - in: body
 *        required: true
 *        name: isAdmin
 *        type: boolean
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       500:
 *         description: Some server error
 */
const express = require("express");
const router = express.Router();
const jwtDecode = require("jwt-decode");
const userModel = require("../models/userModel").userModel;
const auth = require("../middleware/checkAuth");

router.get("/api/login", async (req, res) => {
    let jwt = req.headers.authorization.split(" ")[1];
    if (!jwt) {
        return;
    }
    let user = jwtDecode(jwt);
    await userModel.addUser(
        user.email,
        user.firstname,
        user.lastname,
        false,
        user.eligibleAdmin
    );
    let details = await userModel.findOne(user.email);
    return res.status(200).send(details.isAdmin);
});

//no swagger yet
router.post("/api/logouttime", async (req, res) => {
    if (!auth.authenticateToken(req, false)) return res.sendStatus(403);
    const getLogoutTime = await logoutTime(req.body.email);
    return res.status(200).send(getLogoutTime);
});

router.get("/api/admin", async (req, res) => {
    if (!auth.authenticateToken(req, true)) return res.sendStatus(403);
    return res.status(200).send(await userModel.findAdmins());
});

router.post("/api/admin", async (req, res) => {
    if (!auth.authenticateToken(req, true)) return res.sendStatus(403);
    let admin = req.body;
    if (!admin.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).send({ error: "Must be a valid email" });
    }
    let exist = await userModel.findOne(admin.email);
    let response = await userModel.updateAdmin(admin.email, admin.isAdmin);
    if (response) {
        return res.status(400).send({ error: response });
    }
    if (exist == null || exist.firstName === "N/A") {
        return res.status(200).send({ error: "User has never logged in!" });
    } else {
        return res.status(200).send({ error: "" });
    }
});
module.exports = router;
