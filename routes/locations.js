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
