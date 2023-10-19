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
const fs = require('fs');

/**
 * Logs the provided error based on the environment setting.
 *
 * @param {string} context - Context in which the error occurred.
 * @param {Error} error - The actual error object.
 */
function logError(context, error) {
    const errorMessage = `${new Date()} - Error in ${context}: ${error.message}\n`;
    if (process.env.NODE_ENV === "development") {
        fs.appendFileSync("error_log.txt", errorMessage);
    } else {
        console.error(error);
    }
}

/**
 * GET /api/calendar
 * Endpoint to retrieve calendar data for a specific month.
 *
 * Requires authentication and returns a 403 status if authentication fails.
 * Returns calendar data for the specified month and year.
 */
router.get("/api/calendar", async (req, res) => {
    if (!auth.authenticateToken(req, false)) return res.sendStatus(403);

    try {
        const results = await updateForm.findMonth(req.query.month, req.query.year);
        if (results) {
            res.status(200).send({ results });
        } else {
            res.status(404).send({ error: "Error finding month" });
        }
    } catch (err) {
        logError("GET /api/calendar", err);
        if (err.code === 'INVALID_FORMAT') {
            res.status(400).send({ error: err.message });
        } else {
            res.status(500).send({ error: err.message });
        }
    }
});

/**
 * POST /api/calendar
 * Endpoint to update or add calendar events.
 *
 * Requires authentication and returns a 403 status if authentication fails.
 * Accepts a body with calendar event data and updates or adds events based on the provided data.
 */
router.post("/api/calendar", async (req, res) => {
    if (!auth.authenticateToken(req, true)) return res.sendStatus(403);

    try {
        const results = await updateForm.updateCalendar(req.body.forms);
        if (results) {
            res.status(200).send({ message: "Calendar updated successfully" });
        } else {
            res.status(500).send({ error: "Error updating month" });
        }
    } catch (err) {
        logError("POST /api/calendar", err);
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
