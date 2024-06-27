/**
 * @swagger
 * components:
 *   schemas:
 *     Series:
 *       type: object
 *       required:
 *         - start_date
 *         - end_date
 *         - start_time
 *         - end_time
 *         - recurrence_frequency_weeks
 *         - recurrence_frequency_days
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the series
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: Start time of the series in ISO8601 format
 *         end_time:
 *           type: string
 *           format: date-time
 *           description: End time of the series in ISO8601 format
 *         start_date:
 *           type: string
 *           format: date
 *           description: Start date of the series in ISO8601 format
 *         end_date:
 *           type: string
 *           format: date
 *           description: End date of the series in ISO8601 format
 *         recurrence_frequency_weeks:
 *           type: integer
 *           description: Frequency of recurrence in weeks
 *         recurrence_frequency_days:
 *           type: array
 *           items:
 *             type: integer
 *           description: Days of the week when the series recurs
 *       example:
 *         id: 1
 *         start_time: '2024-05-06T08:00:00Z'
 *         end_time: '2024-05-06T10:00:00Z'
 *         start_date: '2024-05-06'
 *         end_date: '2024-06-30'
 *         recurrence_frequency_weeks: 1
 *         recurrence_frequency_days: [1, 3, 5] # Monday, Wednesday, Friday
 *
 * tags:
 *   name: series
 *   description: The series managing API
 *
 * /api/series/{id}:
 *   get:
 *     summary: Retrieve a series by ID
 *     tags: [series]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the series to retrieve
 *     responses:
 *       200:
 *         description: Detailed information about the series
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Series'
 *       400:
 *         description: Validation error on the provided ID
 *       404:
 *         description: Series not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a series by ID
 *     tags: [series]
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
 *             $ref: '#/components/schemas/Series'
 *     responses:
 *       200:
 *         description: Series updated successfully
 *       400:
 *         description: Validation error in the request body
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a series by ID
 *     tags: [series]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Series deleted successfully
 *       500:
 *         description: Server error
 *
 * /api/series:
 *   post:
 *     summary: Create a new series
 *     tags: [series]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Series'
 *     responses:
 *       201:
 *         description: Series created successfully
 *       400:
 *         description: Validation error in the request body
 *       500:
 *         description: Server error
 */

/**
 * @type {ExpressRouter}
 * @namespace seriesRouter
 * @description Router for handling series requests.
 */

const express = require("express");
const { body, validationResult, param } = require("express-validator");
const router = express.Router();
const {
  areSeriesDatesAndFrequenciesEqual,
  mapEventsToSeries,
  getSeries,
  getSeriesEvents,
  createSeries,
  autoGenerateEvents,
  updateSeries,
  updateSeriesEvents,
  deleteSeries,
  autoDeleteEvents,
} = require("../models/series");
const permission_check = require('../middleware/permission_check');
const logger = require("../logger")(module);

// Define validation rules for creating event. Optional fields are not included based on prisma model.
const iso8601ErrorMsg = " must be in valid ISO8601 format";
const seriesValidation = [
  body("start_time")
    .isISO8601()
    .withMessage("start_time" + iso8601ErrorMsg),
  body("end_time")
    .isISO8601()
    .withMessage("end_time" + iso8601ErrorMsg),

  body("start_date")
    .isISO8601()
    .withMessage("start_date" + iso8601ErrorMsg),
  body("end_date")
    .isISO8601()
    .withMessage("end_date" + iso8601ErrorMsg),

  body("recurrence_frequency_weeks")
    .isInt()
    .withMessage("recurrence_frequency_weeks must be an integer")
    .custom((recurrenceFrequencyWeeks, { req }) => {
      if (recurrenceFrequencyWeeks <= 0) {
        throw new Error("recurrence_frequency_weeks must be greater than 0");
      }

      const startDate = new Date(req.body.start_date);
      const endDate = new Date(req.body.end_date);

      const timeDifference = endDate - startDate; // Calculate the time difference in milliseconds
      const weeksDifference = timeDifference / (1000 * 60 * 60 * 24 * 7); // Convert time difference from milliseconds to weeks

      // Check if the provided weeks exceed the weeks between the dates
      if (recurrenceFrequencyWeeks > weeksDifference) {
        throw new Error(
          `recurrence_frequency_weeks [${recurrenceFrequencyWeeks}] exceeds number of weeks between [${startDate.toDateString()}] & [${endDate.toDateString()}] which is [${weeksDifference.toFixed(2)}] weeks.`);
      }

      return true;
    }),

  body("recurrence_frequency_days")
    .isArray()
    .withMessage("recurrence_frequency_days must be an array")
    .custom((recurrenceFrequencyDays) => {
      if (recurrenceFrequencyDays.length === 0) {
        throw new Error("recurrence_frequency_days must not be an empty array");
      }
      return true;
    }),
  body("recurrence_frequency_days.*")
    .isInt({ min: 0, max: 6 }) // 0 for Sunday, 6 for Saturday
    .withMessage("Each item in recurrence_frequency_days must be an integer"),
];

// Define validation rules for series id. Only positive integers are allowed.
const seriesIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("id must be a positive integer"),
];

/**
 * GET /api/series/:id
 * Endpoint to retrieve a series by id.
 */
router.get("/series/:id", seriesIdValidation, async (req, res) => {
  //validate the series ID
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const seriesId = parseInt(req.params.id); // Parse the id to an integer to ensure it is a number
  try {
    const series = await getSeries(seriesId);
    if (!series) {
      return res.status(404).send({ error: "Series not found" });
    }
    return res.status(200).send(series);
  } catch (error) {
    logger.error({
      message: `GET /api/series/${seriesId}`,
      error: error.stack,
    });
    return res.status(500).send({ error: error.message });
  }
});

/**
 * POST /api/series
 * Endpoint to create a new event.
 */
router.post("/series", 
  permission_check(['admin']),
  seriesValidation, async (req, res) => {
  try {
    // express validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventIds = await autoGenerateEvents(req.body);
    const seriesDataWithEvents = mapEventsToSeries(req.body, eventIds);

    const newSeries = await createSeries(seriesDataWithEvents);
    return res.status(201).send(newSeries);
  } catch (error) {
    logger.error({ message: "POST /api/series", error: error.stack });
    return res.status(500).send({ error: error.message });
  }
});

/**
 * PUT /api/series/:id
 * Endpoint to update an series by ID.
 */
router.put("/series/:id", 
  permission_check(['admin']),
  async (req, res) => {
  // Convert the ID from string to a base 10 integer
  const id = parseInt(req.params.id, 10);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingSeries = await getSeries(id);
    // Add ID to payload
    let updatedEventsData = req.body;
    updatedEventsData.series_id = id;
    updatedEventsData.events = existingSeries.events;

    try {
      // If Dates and Frequencies unchanged, update events
      if (
        areSeriesDatesAndFrequenciesEqual(existingSeries, updatedEventsData)
      ) {
        await updateSeriesEvents(updatedEventsData);
      } else {
        // Otherwise, delete existing ones linked to the Series and create batch with new properties
        await autoDeleteEvents(id);
        updatedEventsData.created_by = existingSeries.created_by; // Must be before autoGenerateEvents
        const eventIds = await autoGenerateEvents(updatedEventsData);
        updatedEventsData = mapEventsToSeries(updatedEventsData, eventIds);
      }
    } catch (error) {
      throw new Error(`Error processing series events: ${error.message}`);
    }

    const updatedSeries = await updateSeries(updatedEventsData);
    return res.status(200).send(updatedSeries);
  } catch (error) {
    logger.error({ message: `PUT /api/series/${id}`, error: error.stack });
    return res.status(500).send({ error: error.message });
  }
});

/**
 * DELETE /api/series/:series_id
 * Endpoint to delete a series by id.
 * @param {number} series_id - series id to delete
 */
router.delete("/series/:series_id", 
  permission_check(['admin']),
  async (req, res) => {
  const series_id = parseInt(req.params.series_id, 10);
  try {
    await autoDeleteEvents(series_id); // Must delete linked Events before Series itself
    const deletedSeries = await deleteSeries(series_id);

    return res.status(200).send(deletedSeries);
  } catch (error) {
    logger.error({
      message: `DELETE /api/series/${series_id}`,
      error: error.stack,
    });
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
