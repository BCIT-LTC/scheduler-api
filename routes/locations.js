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
 *     summary: Create a new location
 *     tags: [locations]
 *     consumes: application/json
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
 *                 description: The email of the user who created the location
 *                 example: "admin@bcit.ca"
 *             required:
 *               - room_location
 *               - created_by
 *     responses:
 *       201:
 *         description: Location created successfully
 *       500:
 *         description: Some server error
 *
 * /api/locations/{id}:
 *   put:
 *     summary: Update a location that already exists
 *     tags: [locations]
 *     consumes: application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the location to update
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
 *               modified_by:
 *                 type: string
 *                 description: The email of the user who modified the location
 *                 example: "admin@bcit.ca"
 *             required:
 *               - room_location
 *               - modified_by
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       404:
 *         description: Location not found
 *       500:
 *         description: Some server error
 * 
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
const router = express.Router();
const {
  getLocations,
  createLocation,
  updateLocation,
  getLocationById,
  deleteLocation,
} = require("../models/locations");
const { body, validationResult } = require("express-validator");

const validateLocation = (field) => [
  body("room_location").notEmpty().withMessage("Room location is required"),
  body(field).notEmpty().withMessage(`${field} is required`),
  body(field).isEmail().withMessage(`${field} must be an email`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


const checkID = [
  (req, res, next) => {
    const { id } = req.params;
    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "ID must be a positive number" });
    }
    next();
  },
];

/**
 * Middleware for handling get location requests.
 * @name locationsRouter.get
 * @function
 * @memberof locationsRouter
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<any>} - The response data from the locations call.
 */
router.get("/locations", async (req, res) => {
  try {
    const locations = await getLocations();
    return res.status(200).send(locations);
  } catch (error) {
    console.error("Error while fetching locations:", error.stack);
    return res.status(500).send({ error: error.message });
  }
});

/**
 * Middleware for handling and API Endpoint to create a location.
 * @name locationsRouter.post
 * @function
 * @memberof locationsRouter
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<any>} - The response data from the locations call.
 */
router.post("/locations", validateLocation("created_by"), async (req, res) => {
  try {
    const location = await createLocation(req.body);
    return res.status(201).send(location);
  } catch (error) {
    console.error("Error while adding a location:", error.stack);
    if (error.message.includes("Foreign key constraint failed")) {
      return res.status(400).send({ error: error.message });
    }
    res.status(500).send({ error: error.message });
  }
});

/**
 * Middleware for handling update location requests.
 * @name locationsRouter.put
 * @function
 * @memberof locationsRouter
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<any>} - The response data from the locations call.
 */
router.put("/locations/:id", checkID, validateLocation("modified_by"), async (req, res) => {
  const { id } = req.params;
  const { room_location, modified_by } = req.body;
  if (!id) {
    return res.status(400).send({ error: "ID is required" });
  }
  if (!room_location || !modified_by) {
    return res
      .status(400)
      .send({ error: "Room location and modified by are required" });
  }
  const data = { location_id: id, room_location, modified_by };

  try {
    const location = await getLocationById(id);
    if (!location) {
      return res
        .status(404)
        .send({ error: "Record to update does not exist." });
    }
    const updatedLocation = await updateLocation(data);
    return res.status(200).send(updatedLocation);
  } catch (error) {
    console.error("Error while updating a location:", error.stack);
    return res.status(500).send({ error: error.message });
  }
});

/**
 * Middleware for handling delete location requests.
 * @name locationsRouter.delete
 * @function
 * @memberof locationsRouter
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<any>} - The response data from the locations call.
 */
router.delete("/locations/:id?", checkID, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ error: "ID is required" });
  }
  try {
    const location = await getLocationById(id);
    if (!location) {
      return res
        .status(404)
        .send({ error: "Record to delete does not exist." });
    }
    await deleteLocation(id);
    return res.status(200).send({ message: "Success" });
  } catch (error) {
    console.error("Error while deleting a location:", error.stack);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
