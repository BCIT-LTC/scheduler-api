const express = require("express");
const router = express.Router();
const { 
  getEventsByDate,
  getEventsByMonth 
} = require("../models/events");
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);

/**
 * GET /api/events/day
 * Endpoint to retrieve the events for a specific day.
 */
router.get("/api/events/day", async (req, res) => {
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

module.exports = router;