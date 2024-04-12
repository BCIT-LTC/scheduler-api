const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const {
  getEventsByDate,
  getEventsByMonth,
  getEventsByWeek,
  getEventsByRange,
  createEvent,
  deleteEvent,
} = require("../models/events");
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);

// Define validation rules for creating event. Optional fields are not included based on prisma model.
const eventValidation = [
  body("location_id").isInt(),
  body("start_time").isISO8601().toDate(), // Convert to date
  body("end_time").isISO8601().toDate(), // Convert to date
];

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
    logger.error({ message: "GET /api/events/day", error: error.stack });
    res.status(500).send({ error: error.message });
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
    logger.error({ message: "GET /api/events/month", error: error.stack });
    return res.status(500).send({ error: error.message });
  }
});

/**
 * GET /api/events/week
 * Endpoint to retrieve the events for a specific week.
 */
router.get("/events/week", async (req, res) => {
  const date = req.query.date
    ? new Date(req.query.date + "T00:00:00")
    : new Date();
  try {
    const events = await getEventsByWeek(date);
    return res.status(200).send(events);
  } catch (error) {
    logger.error({ message: "GET /api/events/week", error: error.stack });
    return res.status(500).send({ error: error.message });
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
    logger.error({ message: "GET /api/events", error: error.stack });
    return res.status(500).send({ error: error.message });
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
      return res.status(400).json({ errors: errors.array() });
    }

    const newEvent = await createEvent(req.body);
    return res.status(201).send(newEvent);
  } catch (error) {
    logger.error({ message: "POST /api/events", error: error.stack });
    return res.status(500).send({ error: error.message });
  }
});

/**
 * DELETE /api/events/:id
 * Endpoint to delete an event by ID.
 * Note: so far only used to delete test events in unit tests
 */
router.delete("/events/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteEvent(id);
    return res.status(200).send({ message: "Event deleted successfully" });
  } catch (error) {
    logger.error({ message: `DELETE /api/events/${id}`, error: error.stack });
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
