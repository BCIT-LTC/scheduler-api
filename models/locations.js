const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require("../logger");
const logger = createLogger(module);
const userModel = require("./userModel").userModel;

/**
 * Returns all locations in the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of location objects.
 * @throws {Error} If there is an error fetching the locations.
 */

/**
 * Returns all locations in the database.
 * @typedef {PrismaClient.Location} Location
 */

/**
 * Find an location by its id
 * @async
 * @param {number} id - the id of the location
 * @returns {Object} the location object
 */
const getLocationById = async (id) => {
    try {
        var locationId = parseInt(id);
        return await prisma.location.findUnique({
            where: {
            location_id: locationId,
            },
        });
    } catch (error) {
        logger.error({ message: "Error fetching location", error: error.stack });
    }
};

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
 * Create a location and append to the database.
 *
 * @type {Location}
 * @namespace PrismaClient
 * @description Prisma Method create a location to database.
 * @date 2024-05-08 - 4:26:41 p.m.
 * @async
 * @param {Object} location - Takes room_location and modified_by from location
 * @returns {unknown}
 */
const createLocation = async (location) => {
    const { room_location, created_by } = location;

    // If one of the fields is empty
    if (!room_location || !created_by) {
        throw new Error('Missing required fields');
    }

    // If the user does not exist in the database
    try {
        const user = await userModel.findOne(created_by);
        if (!user) {
            throw new Error('User does not exist');
        }
    } catch (error) {
        throw error;
    }

    try {
        return await prisma.location.create({
            data: { 
                room_location, 
                creator: { connect: { email: created_by } },
            }
        })
    } catch (error) {
        // If room_location already exists
        if (error.code === 'P2002' && error.meta.target.includes('room_location')) {
            throw new Error('Location already exists');
        }

        logger.error({ message: "Error creating location", error: error.stack });
        throw error;   
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


/**
 * Delete a location from the database.
 *
 * @type {Location}
 * @namespace PrismaClient
 * @description Prisma Method delete a location from the database.
 * @date 2024-05-17 - 9:57:41 a.m.
 * @async
 * @param {Number} param_id - id of the location to be deleted in string form
 * @returns {Promise<object>} a promise that resolves to the result of the delete operation
 */
const deleteLocation = async (param_id) => {
    try {
      var id = parseInt(param_id); // parse and change to int
      return await prisma.location.delete({ where: { location_id: id } });
    } catch (error) {
      logger.error({ message: "Error deleting location", error: error.stack });
    }
};

module.exports = {
  getLocationById,
  getLocations,
  createLocation,
  deleteLocation,
  updateLocation,
};
