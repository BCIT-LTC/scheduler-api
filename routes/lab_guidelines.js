/**
 * @swagger
 * components:
 *   schemas:
 *     calendar:
 *       type: object
 *       required:
 *         - calendar_id
 *         - date
 *         - start_time
 *         - end_time
 *         - facilitator
 *         - room
 *         - stat
 *       properties:
 *         calendar_id:
 *           type: integer
 *           description: The auto-generated id of the calendar
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the Open Lab
 *         start_time:
 *           type: string
 *           format: time
 *           description: Start time of the Open Lab
 *         end_time:
 *           type: string
 *           format: time
 *           description: Start time of the Open Lab
 *         facilitator:
 *           type: string
 *           description: The supervisor of the Open Lab
 *         room:
 *           type: string
 *           description: The room the Open Lab is in
 *         stat:
 *           type: integer
 *           description: If it is on a stat
 *       example:
 *         calendar_id: 1
 *         date: 2023-04-28
 *         start_time: 10:00:00.000Z
 *         end_time: 12:00:00.000Z
 *         facilitator: Sam
 *         room: SE12-327
 *         stat: 0
 */

/**
 * @swagger
 * tags:
 *   name: calendar
 *   description: The announcements managing API
 * /api/calendar:
 *   get:
 *     summary: Retrieve the details for a month
 *     tags: [calendar]
 *     parameters:
 *      - in: query
 *        name: month
 *        schema:
 *         - type: integer
 *        description: Which month to retrieve details for
 *     responses:
 *       200:
 *         description: The list of data for the month
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/calendar'
 *       404:
 *         description: Month data not found
 *       500:
 *         description: Some server error
 *   post:
 *     summary: Add calendar events
 *     tags: [calendar]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        required: true
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            calendar_id:
 *              type: integer
 *            date:
 *              type: string
 *              format: date
 *            start_time:
 *             type: string
 *             format: time
 *            end_time:
 *             type: string
 *             format: time
 *            facilitator:
 *             type: string
 *            room:
 *             type: string
 *            stat:
 *             type: integer
 *     responses:
 *       200:
 *         description: Event added successfully
 *       500:
 *         description: Some server error
 * /api/openlab:
 *   post:
 *     summary: Update calendar events
 *     tags: [calendar]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        required: true
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            calendar_id:
 *              type: integer
 *            date:
 *              type: string
 *              format: date
 *            start_time:
 *             type: string
 *             format: time
 *            end_time:
 *             type: string
 *             format: time
 *            facilitator:
 *             type: string
 *            room:
 *             type: string
 *            stat:
 *             type: integer
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       500:
 *         description: Some server error
 */
const express = require("express");
const router = express.Router();
const auth = require("../middleware/checkAuth");

const multer = require('multer');
const fs = require('fs');

const app = express();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create Multer instance
const upload = multer({
  storage
});

const uploadSinglePdfFile = upload.single('pdfFile');

router.get("/api/labGuidelines", function (req, res) {
  if (!auth.authenticateToken(req, false)) return res.sendStatus(403);
  console.log(req.body)

});

router.post("/api/labGuidelines", function (req, res) {
  if (!auth.authenticateToken(req, true)) return res.sendStatus(403);
  console.log(req.body);
  
  // TODO: uploading file middleware
  uploadSinglePdfFile(req, res, (err) => {
    console.log(req.body);
    if (err instanceof multer.MulterError) {
      // A Multer error occurred
      return res.status(400).json({
        error: err.message
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({
        error: 'An error occurred'
      });
    }

    // File has been uploaded and saved, do further processing if needed
    res.status(200).send('File uploaded successfully!');
  });
  // console.log(req.body);
  // if (!auth.authenticateToken(req, true)) return res.sendStatus(403);
  // console.log(req.body);
  // res.status(200);
});

module.exports = router;
