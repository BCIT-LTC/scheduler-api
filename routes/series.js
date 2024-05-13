const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { createSeries } = require("../models/series");
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);

// Define validation rules for creating event. Optional fields are not included based on prisma model.
const seriesValidation = [
  body("start_time").isISO8601().toDate(), // Convert to date
  body("end_time").isISO8601().toDate(), // Convert to date
  body("recurrence_frequency_weeks").isInt(),
];

/**
 * POST /api/series
 * Endpoint to create a new event.
 */
router.post("/series", seriesValidation, async (req, res) => {
  try {
    // express validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newSeries = await createSeries(req.body);
    return res.status(201).send(newSeries);
  } catch (error) {
    logger.error({ message: "POST /api/series", error: error.stack });
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
