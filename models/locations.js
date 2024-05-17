const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require("../logger");
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
 * Retrieve a list of all the locations.
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

/**
 * Update an existing location
 *
 * @param {Object} location - location to update
 * @returns {Promise<Object>} promise that resolves to the updated location object
 */
const updateLocation = async (location) => {
  try {
    // IDs should be unique with no duplicates
    const e = await prisma.location.findUnique({
      where: { location_id: location.location_id },
    });
    if (!e) {
      throw new Error(`Location with id ${location.location_id} not found`);
    }
    const updatedLocation = await prisma.location.update({
      where: { location_id: e.location_id },
      data: {
        room_location: location.room_location,
        modifier: { connect: { email: location.modified_by } },
      },
    });
    return updatedLocation;
  } catch (error) {
    logger.error({
      message: `Error updating location: ${error.message}`,
      error: error.stack,
    });
    throw error;
  }
};

module.exports = {
  getLocations,
  updateLocation,
};
