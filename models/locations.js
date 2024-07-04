const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


/**
 * @namespace locationsModel
 * @description model for handling locations requests.
 */

/**
 * Find an location by its id
 * @name getLocationById
 * @memberof locationsModel
 * @async
 * @function
 * @param {number} id - the id of the location
 * @returns {Object} the location object
 */
const getLocationById = async (id) => {
  try {
    return await prisma.location.findUnique({
      where: {
        location_id: parseInt(id),
      },
    });
  } catch (error) {
    console.error("Error fetching location:", error.stack);
    throw new Error("Error fetching location");
  }
};

/**
 * Retrieve a list of all the locations.
 * @name getLocations
 * @type {Location}
 * @memberof locationsModel
 * @description Prisma Method retrieving locations from the database.
 * @date 2023-05-17 - 10:41:51 p.m.
 * @async
 * @function
 * @returns {Object} List of all locations.
 */
const getLocations = async () => {
  try {
    return await prisma.location.findMany();
  } catch (error) {
    console.error("Error fetching locations:", error.stack);
    throw new Error("Error fetching locations");
  }
};

/**
 * Create a location and append to the database.
 * @name createLocation
 * @type {Location}
 * @memberof locationsModel
 * @description Prisma Method create a location to database.
 * @date 2024-05-08 - 4:26:41 p.m.
 * @async
 * @function
 * @param {Object} location - Takes room_location and modified_by from location
 * @returns {unknown}
 */
const createLocation = async (location) => {
  const { room_location, created_by } = location;
  try {
    return await prisma.location.upsert({
      update: {
        room_location,
        creator: { connect: { email: created_by } },
      },
      create: {
        room_location,
        creator: { connect: { email: created_by } },
      },
      where: { room_location },
    });
  } catch (error) {
    console.error("Error creating location:", error.stack);
    throw error;
  }
};

/**
 * Update a location from the database.
 * @name updateLocation
 * @type {Location}
 * @memberof locationsModel
 * @description Prisma Method update a location from the database.
 * @date 2024-05-17 - 9:57:41 a.m.
 * @async
 * @function
 * @param {Number} id - id of the location to be updated in string form
 * @returns {Promise<object>} a promise that resolves to the result of the update operation
 */
const updateLocation = async (location) => {
  const { location_id, room_location, modified_by } = location;
  try {
    return await prisma.location.update({
      where: { location_id: parseInt(location_id) },
      data: {
        room_location,
        modifier: { connect: { email: modified_by } },
      },
    });
  } catch (error) {
    console.error("Error updating location:", error.stack);
    throw new Error("Error updating location: " + error.stack);
  }
};


/**
 * Delete a location from the database.
 * @name deleteLocation
 * @type {Location}
 * @memberof locationsModel
 * @description Prisma Method delete a location from the database.
 * @date 2024-05-17 - 9:57:41 a.m.
 * @async
 * @function
 * @param {Number} id - id of the location to be deleted in string form
 * @returns {Promise<object>} a promise that resolves to the result of the delete operation
 */
const deleteLocation = async (id) => {
  try {
    return await prisma.location.delete({
      where: { location_id: parseInt(id) },
    });
  } catch (error) {
    console.error("Error deleting location:", error.stack);
    throw new Error("Error deleting location");
  }
};

module.exports = {
  getLocationById,
  getLocations,
  createLocation,
  deleteLocation,
  updateLocation,
};
