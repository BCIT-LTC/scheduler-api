/**
 * @swagger
 * components:
 *   schemas:
 *     announcements:
 *       type: object
 *       required:
 *         - announcements_id
 *         - title
 *         - description
 *         - date
 *       properties:
 *         announcements_id:
 *           type: integer
 *           description: The auto-generated id of the announcement
 *         title:
 *           type: string
 *           description: The title of the announcement
 *         description:
 *           type: string
 *           description: The description of the announcement
 *         date:
 *           type: string
 *           format: date
 *           description: The date the announcement was last modified
 *       example:
 *         announcements_id: 1
 *         title: Welcome!
 *         description: Welcome to the BSN OpenLab Scheduler!
 *         date: 2023-04-28T10:05:16.000Z
 */

/**
 * @swagger
 * tags:
 *   name: announcements
 *   description: The announcements managing API
 * /api/announcement:
 *   get:
 *     summary: Retrieve the announcements
 *     tags: [announcements]
 *     responses:
 *       200:
 *         description: The list of announcements
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/announcements'
 *       500:
 *         description: Some server error
 *   post:
 *     summary: Update or add announcements
 *     tags: [announcements]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: title
 *        required: true
 *      - in: body
 *        name: description
 *        required: true
 *      - in: body
 *        name: date
 *        required: true
 *     responses:
 *       200:
 *         description: Announcement that was added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/announcements'
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Remove an annoucement
 *     tags: [announcements]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: id
 *        required: true
 *     responses:
 *       200:
 *         description: Announcement is delete
 *       500:
 *         description: Some server error
 */

const express = require("express");
const router = express.Router();
const {
    getAnnouncement,
    addAnnouncement,
    deleteAnnouncement,
} = require("../models/announcement");
const auth = require("../middleware/checkAuth");

router.get("/api/announcement", async (req, res) => {
    if (!auth.authenticateToken(req, false)) return res.sendStatus(403);
    try {
        const announcement = await getAnnouncement();
        return res.status(200).send(announcement);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

//endpoint for adding or editing announcements
router.post("/api/announcement", async (req, res) => {
    if (!auth.authenticateToken(req, true)) return res.sendStatus(403);
    let title = req.body.title;
    let description = req.body.description;
    let date = req.body.date;
    try {
        const announcement = addAnnouncement(title, description, new Date(date));
        res.status(200).send(announcement);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//endpoint for deleting announcements
router.delete("/api/announcement", async (req, res) => {
    if (!auth.authenticateToken(req, true)) return res.sendStatus(403);
    let id = req.body.id;
    try {
        await deleteAnnouncement(id);
        return res.status(200).send({ message: "Success" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});


module.exports = router;