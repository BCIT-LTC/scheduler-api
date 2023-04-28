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
 *           type: int
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
 *
 */

const express = require("express");
const router = express.Router();
const {
    getAnnouncement,
    addAnnouncement,
    deleteAnnouncement,
  } = require("../models/announcement");

router.get("/api/announcement", async (req, res) => {
    try {
        const announcement = await getAnnouncement();

        return res.status(200).send(announcement);
    } catch (error) {
        return res.status(401).send({ error: error.message });
    }
});

//endpoint for adding announcements
router.post("/api/add", async (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let date = req.body.date;
    try {
        const announcement = addAnnouncement(title, description, date);
        res.status(200).send(announcement);
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

//endpoint for deleting announcements
router.post("/api/delete", async (req, res) => {
    let id = req.body.id;
    try {
        await deleteAnnouncement(id);

        return res.status(200).send({ message: "Success" });
    } catch (error) {
        return res.status(401).send({ error: error.message });
    }
});

//endpoint for editing announcements
router.post("/api/edit", async (req, res) => {
    let title = req.body.title;
    try {
        const announcement = await editAnnouncement(title);
        res.status(200).send(announcement);
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

module.exports = router;