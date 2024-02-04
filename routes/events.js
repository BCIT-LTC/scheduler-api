const express = require("express");
const router = express.Router();
const { getEventsByDate } = require("../models/events");
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);

/**
 * GET /api/events/day
 * Endpoint to retrieve the events for a specific day.
 */
//add optional date parameter
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
