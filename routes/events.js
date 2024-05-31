/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - location_id
 *         - start_time
 *         - end_time
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the event
 *         location_id:
 *           type: integer
 *           description: The ID of the location associated with the event
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: Start time of the event in ISO8601 format
 *         end_time:
 *           type: string
 *           format: date-time
 *           description: End time of the event in ISO8601 format
 *       example:
 *         id: 1
 *         location_id: 5
 *         start_time: '2024-06-25T15:30:00Z'
 *         end_time: '2024-06-25T17:30:00Z'
 *
 * tags:
 *   name: events
 *   description: API endpoints for managing events
 *
 * /api/events/{id}:
 *   get:
 *     summary: Retrieve an event by ID
 *     tags: [events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the event to retrieve
 *     responses:
 *       200:
 *         description: Detailed information about the event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update an event by ID
 *     tags: [events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Validation error in the request body
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 *
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Validation error in the request body
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Retrieve events by date range
 *     tags: [events]
 *     parameters:
 *       - in: query
 *         name: start
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date and time of the event range
 *       - in: query
 *         name: end
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date and time of the event range
 *     responses:
 *       200:
 *         description: List of events in the specified range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */

/**
 * @type {ExpressRouter}
 * @namespace eventsRouter
 * @description Router for handling events requests.
 */

const express = require("express");
const {
  body,
  validationResult
} = require("express-validator");
const router = express.Router();
const {
  getEventById,
  getEventsByDate,
  getEventsByMonth,
  getEventsByWeek,
  getEventsByRange,
  createEvent,
  deleteEvent,
  updateEvent,
} = require("../models/events");
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);

// Define validation rules for creating event. Optional fields are not included based on prisma model.
const dateErrorMsg = "Must be a valid ISO8601 format. Eg: 2024-06-25T15:30:00";
const eventValidation = [
  body("location_id").isInt(),
  body("start_time").isISO8601().withMessage(dateErrorMsg).toDate(), // Validate ISO8601 format
  body("end_time").isISO8601().withMessage(dateErrorMsg).toDate(),
];

/**
 * GET /api/events/:id
 * Endpoint to retrieve an event by ID.
 */
router.get("/events/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).send({
        error: "Event not found"
      });
    }
    return res.status(200).send(event);
  } catch (error) {
    logger.error({
      message: `GET /api/events/${id}`,
      error: error.stack
    });
    return res.status(500).send({
      error: error.message
    });
  }
});

/**
 * GET /api/events/day
 * Endpoint to retrieve the events for a specific day.
 */
router.get("/events/day", async (req, res) => {
  // optional date parameter, if one is not provided system time is used
  const date = req.query.date ? new Date(req.query.date) : new Date();
  try {
    const events = await getEventsByDate(date);
    res.status(200).send(events);
  } catch (error) {
    logger.error({
      message: "GET /api/events/day",
      error: error.stack
    });
    res.status(500).send({
      error: error.message
    });
  }
});

/**
 * GET /api/events/month
 * Endpoint to retrieve the events for a specific month.
 */
router.get("/events/month", async (req, res) => {
  const date = req.query.date ? new Date(req.query.date) : new Date();
  try {
    const events = await getEventsByMonth(date);
    return res.status(200).send(events);
  } catch (error) {
    logger.error({
      message: "GET /api/events/month",
      error: error.stack
    });
    return res.status(500).send({
      error: error.message
    });
  }
});

/**
 * GET /api/events/week
 * Endpoint to retrieve the events for a specific week.
 */
router.get("/events/week", async (req, res) => {
  const date = req.query.date ?
    new Date(req.query.date + "T00:00:00") :
    new Date();
  try {
    const events = await getEventsByWeek(date);
    return res.status(200).send(events);
  } catch (error) {
    logger.error({
      message: "GET /api/events/week",
      error: error.stack
    });
    return res.status(500).send({
      error: error.message
    });
  }
});

/**
 * GET /api/events
 * Endpoint to retrieve the events for the current FullCalendar view.
 */
router.get("/events", async (req, res) => {
  const start = req.query.start;
  const end = req.query.end;

  try {
    const events = await getEventsByRange(start, end);
    return res.status(200).send(events);
  } catch (error) {
    logger.error({
      message: "GET /api/events",
      error: error.stack
    });
    return res.status(500).send({
      error: error.message
    });
  }
});

/**
 * POST /api/events
 * Endpoint to create a new event.
 */
router.post("/events", eventValidation, async (req, res) => {
  try {
    // express validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const newEvent = await createEvent(req.body);
    return res.status(201).send(newEvent);
  } catch (error) {
    logger.error({
      message: "POST /api/events",
      error: error.stack
    });
    return res.status(500).send({
      error: error.message
    });
  }
});

/**
 * DELETE /api/events/:id
 * Endpoint to delete an event by ID.
 * Note: so far only used to delete test events in unit tests
 */
router.delete("/events/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).send({
        error: "Event not found"
      });
    }
    await deleteEvent(id);
    return res.status(200).send({
      message: "Event deleted successfully"
    });
  } catch (error) {
    logger.error({
      message: `DELETE /api/events/${id}`,
      error: error.stack
    });
    return res.status(500).send({
      error: error.message
    });
  }
});

/**
 * PUT /api/events/:id
 * Endpoint to update an event by ID.
 */
router.put("/events/:id", eventValidation, async (req, res) => {
  const id = req.params.id;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const updatedEvent = await updateEvent(req.body);
    return res.status(200).send(updatedEvent);
  } catch (error) {
    logger.error({
      message: `PUT /api/events/${id}`,
      error: error.stack
    });
    return res.status(500).send({
      error: error.message
    });
  }
});

module.exports = router;
