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
 *           type: string (User.email)
 *           description: the user who last modified the location
 *       example:
 *         location_id: 1
 *         room_location: NW4-3087
 *         created_at: 2024-05-06T07:35:25.000Z
 *         last_modified: 2024-05-06T07:35:25.000Z
 *         modified_by: admin@bcit.ca
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
 *   post:
 *     summary: Update or add locations
 *     tags: [locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room_location:
 *                 type: string
 *                 description: The location of the room
 *                 example: "NW4-3591"
 *               created_by:
 *                 type: string
 *                 description: The email of the user who modified the location
 *                 example: "admin@bcit.ca"
 *             required:
 *               - room_location
 *               - created_by
 *     responses:
 *       200:
 *         description: Location that was added
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Delete a location
 *     tags: [locations]
 *     consumes: application/json
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *     responses:
 *       200: 
 *         description: Location deleted successfully
 *       500:
 *         description: Some server error 
 * 
 */

/**
 * Express router for handling API requests.
 * @typedef {express.Router} ExpressRouter
 */

/**
 * @type {ExpressRouter}
 * @namespace locationsRouter
 * @description Router for handling locations requests.
 */

const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const {
    
    getLocations,
    createLocation,
    updateLocation,
    getLocationById,
    deleteLocation,
} = require("../models/locations");
const createLogger = require("../logger");
const logger = createLogger(module);
const locationValidation = [ body("room_location") ];


/**
 * Middleware for handling get location requests.
 * @name apiRouter.get
 * @function
 * @memberof locationsRouter
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
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
 * Middleware for handling and API Endpoint to create a location.
 * @name apiRouter.post
 * @function
 * @memberof locationsRouter
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<any>} - The response data from the locations call.
 */
router.post("/locations", locationValidation, async (req, res) => {
    // Validate inputs if they are missing
    try {
        // location validation value check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const location = await createLocation(req.body);
        res.status(200).send(location);
    } catch (error) {
        logger.error({ 
            message: "POST /api/locations", 
            error: error.stack 
        });
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

/**
 * Middleware for handling delete location requests.
 * @name apiRouter.delete
 * @function
 * @memberof locationsRouter
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<any>} - The response data from the locations call.
 */
router.delete("/locations/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const location = await getLocationById(id);
        if (!location) { // checks if location exists
            return res.status(404).send({ error: "Location not found"});
        }
        await deleteLocation(id);
        return res.status(200).send({ message: "Location deleted successfully"});
    } catch (error) {
        logger.error({ 
            message: `DELETE /api/locations/${id}`, 
            error: error.stack 
        });
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
