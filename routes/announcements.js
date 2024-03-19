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
 *   put:
 *      summary: Edit an announcement
 *      tags: [announcements]
 *      consumes:
 *       - application/json
 *      parameters:
 *      - in: body
 *        name: title
 *        required: true
 *      - in: body
 *        name: description
 *        required: true
 *      responses:
 *       200:
 *         description: Announcement is edited
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
  editAnnouncement,
} = require("../models/announcement");
const auth = require("../middleware/authentication_check");
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);

/**
 * GET endpoint to retrieve all announcements.
 */
router.get("/announcement", async (req, res) => {
  // Check if the user is authenticated
  if (!auth.authentication_check(req, false)) {
    return res.sendStatus(403);
  }
  try {
    const announcement = await getAnnouncement();
    return res.status(200).send(announcement);
  } catch (error) {
    logger.error({
      message: "Error while fetching announcements",
      error: error.stack,
    });
    return res.status(500).send({ error: error.message });
  }
});

/**
 * POST endpoint to add or edit an announcement.
 */
router.post("/announcement", async (req, res) => {
  // Check if the user is authenticated
  if (!auth.authentication_check(req, true)) return res.sendStatus(403);

  // Validate inputs
  const { title, description, date } = req.body;
  if (!title || !description || !date) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    const announcement = await addAnnouncement(title, description, date);
    res.status(200).send(announcement);
  } catch (error) {
    logger.error({
      message: "Error while adding an announcement",
      error: error.stack,
    });
    res.status(500).send({ error: error.message });
  }
});

/**
 * DELETE endpoint to remove an announcement based on its ID.
 */
router.delete("/announcement", async (req, res) => {
  // Check if the user is authenticated
  if (!auth.authentication_check(req, true)) return res.sendStatus(403);

  // Validate inputs
  const { id } = req.body;
  if (!id)
    return res.status(400).send({ error: "ID is required for deletion" });

  try {
    await deleteAnnouncement(id);
    return res.status(200).send({ message: "Success" });
  } catch (error) {
    logger.error({
      message: "Error while deleting an announcement",
      error: error.stack,
    });
    return res.status(500).send({ error: error.message });
  }
});

/**
 * PUT endpoint to edit an announcement based on its ID.
 */
router.put("/announcement", async (req, res) => {
  // Check if the user is authenticated
  if (!auth.authentication_check(req, true)) return res.sendStatus(403);

  // Validate inputs
  const { id, title, description, date } = req.body;
  if (!id || !title || !description) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    const updatedAnnouncement = await editAnnouncement(
      id,
      title,
      description,
      date
    );
    res.status(200).send(updatedAnnouncement);
  } catch (error) {
    logger.error({
      message: "Error while editing an announcement",
      error: error.stack,
    });
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
