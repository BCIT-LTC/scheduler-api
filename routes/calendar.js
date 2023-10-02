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
const updateForm = require("../models/openLabForm");
const auth = require("../middleware/checkAuth");

router.get("/api/calendar", function (req, res) {
    if (!auth.authenticateToken(req, false)) return res.sendStatus(403);
    updateForm
        .findMonth(req.query.month, req.query.year)
        .then((results) => {
            console.log("update form results", results);
            if (results) {
                res.status(200).send({ results });
            } else {
                return res.status(404).send({ error: "Error finding month" });
            }
        })
        .catch((err) => {
            if (err.code === 'INVALID FORMAT') {
                return res.status(400).send({ error: err.message });
            }
            return res.status(500).send({ error: err.message });
        });
});

router.post("/api/calendar", function (req, res) {
    if (!auth.authenticateToken(req, true)) return res.sendStatus(403);

    updateForm
        .updateCalendar(req.body.forms)
        .then((results) => {
            console.log("update form results", results);
            if (results) {
                res.status(200).send({ error: "" });
            } else {
                return res.status(500).send({ error: "Error updateing month" });
            }
        })
        .catch((err) => {
            return res.status(500).send({ error: err.message });
        });
});

module.exports = router;
