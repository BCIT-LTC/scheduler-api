const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);

/**
 * Returns all locations in the database
 * 
 * @returns {Object} list of locations
 */
const getLocations = async () => {
    try {
        return await prisma.location.findMany();
    } catch (error) {
        logger.error({ message: "Error fetching locations", error: error.stack });
    }
};

module.exports = {
    getLocations
};