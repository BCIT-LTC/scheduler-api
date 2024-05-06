
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);

/**
 * Returns all locations in the database.
 * 
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of location objects.
 * @throws {Error} If there is an error fetching the locations.
 */

/**
 * Returns all locations in the database.
 * @typedef {import('@prisma/client').Location} Location
 */

/**
 * Retrieve a list of all the announcements.
 *
 * @type {Location}
 * @namespace PrismaClient
 * @description Prisma Method retrieving locations from the database.
 * @date 2023-05-17 - 10:41:51 p.m.
 * @async
 * @returns {Object} list of all the locations.
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