/**
 * @swagger
 * components:
 *   schemas:
 *     announcements:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - created_by
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the announcement
 *         description:
 *           type: string
 *           description: The description of the announcement
 *         created_by:
 *           type: string
 *           description: The email of the creator
 *       example:
 *         title: Welcome!
 *         description: Welcome to the BSN OpenLab Scheduler!
 *         created_by: admin@example.com
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/announcements'
 *       500:
 *         description: Some server error
 *   post:
 *     summary: Add an announcement
 *     tags: [announcements]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: announcement
 *        required: true
 *        schema:
 *          $ref: '#/components/schemas/announcements'
 *     responses:
 *       200:
 *         description: Announcement that was added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/announcements'
 *       500:
 *         description: Some server error
 * /api/announcement/{id}:
 *   delete:
 *     summary: Remove an announcement
 *     tags: [announcements]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *       200:
 *         description: Announcement is deleted
 *       404:
 *         description: Announcement not found
 *       500:
 *         description: Some server error
 *   put:
 *      summary: Edit an announcement
 *      tags: [announcements]
 *      consumes:
 *       - application/json
 *      parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *      - in: body
 *        name: announcement
 *        required: true
 *        schema:
 *          $ref: '#/components/schemas/announcements'
 *      responses:
 *       200:
 *         description: Announcement is edited
 *       404:
 *         description: Announcement not found
 *       500:
 *         description: Some server error
 */

const express = require("express");
const router = express.Router();
const {
  getAnnouncementById,
  getAnnouncement,
  addAnnouncement,
  deleteAnnouncement,
  editAnnouncement,
} = require("../models/announcement");
const { body, validationResult } = require("express-validator");

const validateAnnouncement = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("created_by").notEmpty().withMessage("Created by is required"),
  body("created_by").isEmail().withMessage("Created by must be an email"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const checkID = [
  (req, res, next) => {
    if (!req.params) {
      return res.status(400).json({ error: "ID is required" });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    if (id === "") {
      return res.status(400).json({ error: "ID must not be empty" });
    }
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "ID must be a positive number" });
    }
    next();
  },
];

/**
 * GET endpoint to retrieve all announcements.
 */
router.get("/announcement", async (req, res) => {
  try {
    const announcements = await getAnnouncement();
    return res.status(200).send(announcements);
  } catch (error) {
    console.error("Error while fetching announcements:", error.stack);
    return res.status(500).send({ error: error.message });
  }
});

/**
 * POST endpoint to add an announcement.
 */
router.post("/announcement", validateAnnouncement, async (req, res) => {
  try {
    const announcement = await addAnnouncement(req.body);
    return res.status(201).send(announcement);
  } catch (error) {
    console.error("Error while adding an announcement:", error.stack);
    if (error.message.includes("Foreign key constraint failed")) {
      return res.status(400).send({ error: error.message });
    }
    res.status(500).send({ error: error.message });
  }
});

/**
 * DELETE endpoint to remove an announcement based on its ID.
 */
router.delete("/announcement/:id?", checkID, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ error: "ID is required" });
  }
  try {
    const announcement = await getAnnouncementById(id);
    if (!announcement) {
      return res
        .status(404)
        .send({ error: "Record to delete does not exist." });
    }
    await deleteAnnouncement(id);
    return res.status(200).send({ message: "Success" });
  } catch (error) {
    console.error("Error while deleting an announcement:", error.stack);
    return res.status(500).send({ error: error.message });
  }
});

/**
 * PUT endpoint to edit an announcement based on its ID.
 */
router.put(
  "/announcement/:id",
  checkID,
  validateAnnouncement,
  async (req, res) => {
    const { id } = req.params;
    const { title, description, modified_by } = req.body;
    try {
      const announcement = await getAnnouncementById(id);
      if (!announcement) {
        return res
          .status(404)
          .send({ error: "Record to update does not exist." });
      }
      const updatedAnnouncement = await editAnnouncement(
        id,
        title,
        description,
        modified_by
      );
      return res.status(200).send(updatedAnnouncement);
    } catch (error) {
      console.error("Error while editing an announcement:", error.stack);
      return res.status(500).send({ error: error.message });
    }
  }
);

module.exports = router;
