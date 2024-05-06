

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

const express = require("express");
const router = express.Router();
const { getLocations } = require("../models/locations");
const createLogger = require("../logger");
const logger = createLogger(module);

/**
 * GET /api/locations
 * Endpoint to retrieve all locations
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

module.exports = router;
