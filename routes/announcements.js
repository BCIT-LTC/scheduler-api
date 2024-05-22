/**
 * @swagger
 * components:
 *   schemas:
 *     announcements:
 *       type: object
 *       required:
 *         - announcement_id
 *         - title
 *         - description
 *         - date
 *       properties:
 *         announcement_id:
 *           type: integer
 *           description: The auto-generated id of the announcement
 *         title:
 *           type: string
 *           description: The title of the announcement
 *         description:
 *           type: string
 *           description: The description of the announcement
 *       example:
 *         announcement_id: 1
 *         title: Welcome!
 *         description: Welcome to the BSN OpenLab Scheduler!
 *         date: 2023-04-28T10:05:16.000Z
 */

/**
 * @swagger
 * tags:
 *   name: announcements
 *   description: The announcements managing API, JWT authentication is required to access this endpoint.
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
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);
const { body, validationResult } = require('express-validator');
const validateAnnouncement = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('created_by').notEmpty().withMessage('Created by is required'),
  body('created_by').isEmail().withMessage('Created by must be an email'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


/**
 * GET endpoint to retrieve all announcements.
 */
router.get("/announcement", async (req, res) => {
  try {
    const announcement = await getAnnouncement();
    
    // Return empty array if no announcements are found
    if (announcement.length === 0) {
      return res.status(200).send([]);
    }

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
router.post("/announcement", validateAnnouncement, async (req, res) => {
  try {
    const announcement = await addAnnouncement(req.body);
    return res.status(200).send(announcement);

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
router.delete("/announcement", validateAnnouncement, async (req, res) => {
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
router.put("/announcement", validateAnnouncement, async (req, res) => {
  const { id, title, description } = req.body;

  try {
    const updatedAnnouncement = await editAnnouncement(
      id,
      title,
      description,
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
