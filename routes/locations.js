/**
 * @swagger
 * components:
 *   schemas:
 *     locations:
 *       type: object
 *       required:
 *         - location_id
 *         - room_location
 *         - modified_by
 *       properties:
 *         location_id:
 *           type: integer
 *           description: The auto-generated id of the location
 *         room_location:
 *           type: string
 *           description: The title of the announcement
 *         modified_by:
 *           type: string
 *           description: the user who last modified the location
 *       example:
 *         location_id: 1
 *         room_location: NW4-3087
 *         created_at: 2024-05-06T07:35:25.000Z
 *         last_modified: 2024-05-06T07:35:25.000Z
 *         modified_by: Alice
 */

/**
 * @swagger
 * tags:
 *   name: locations
 *   description: The locations managing API, JWT authentication is required to access this endpoint.
 * /api/locations:
 *   get:
 *     summary: Retrieve the locations
 *     tags: [locations]
 *     responses:
 *       200:
 *         description: The list of locations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/locations'
 *       500:
 *         description: Some server error
 *
 */

/**
 * Express router for handling API requests.
 * @typedef {import('express').Router} ExpressRouter
 */

/**
 * @type {ExpressRouter}
 * @namespace locationsRouter
 * @description Router for handling locations requests.
 */

const express = require("express");
const { validationResult } = require("express-validator");
const router = express.Router();
const {
    getLocations,
    updateLocation
} = require("../models/locations");
const createLogger = require("../logger");
const logger = createLogger(module);

/**
 * Middleware for handling get location requests.
 * @name apiRouter.get
 * @function
 * @memberof locationsRouter
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<any>} - The response data from the locations call.
 */
router.get("/locations", async (req, res) => {
  try {
    const locations = await getLocations();
    res.status(200).send(locations);
  } catch (error) {
    logger.error({ message: "GET /api/locations", error: error.stack });
    res.status(500).send({ error: error.message });
  }
});

/**
 * PUT /api/location/:id
 * Endpoint to update an location by ID.
 */
router.put("/location/:id", async (req, res) => {
  // Convert the ID from string to a base 10 integer
  const id = parseInt(req.params.id, 10);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add ID to req.body
    req.body.location_id = id;

    const updatedLocation = await updateLocation(req.body);
    return res.status(200).send(updatedLocation);
  } catch (error) {
    logger.error({ message: `PUT /api/location/${id}`, error: error.stack });
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
