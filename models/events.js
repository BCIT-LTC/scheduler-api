const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);

/**
 *  Find all the events for a specific day
 * @async
 * @param {Date} date - the date to search for
 * @returns {Object} list of events
 */
const getEventsByDate = async (date) => {
  var nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1); // Add one day to the date

  try {
    return await prisma.events.findMany({
      where: {
        start_time: {
          gte: date,
        },
        end_time: {
          lt: nextDay, // Less than the next day
        },
      },
    });
  } catch (error) {
    logger.error({ message: "Error fetching events", error: error.stack });
  }
};

/**
 * Find all the events for a specific month
 * 
 * @date 2024-02-08
 * @async
 * @param {Date} date - the date to search for
 * @returns {Object} list of events
 */
const getEventsByMonth = async (date) => {

  let lowerBound = new Date(date);
  lowerBound.setDate(date.getDate() - 15);

  let upperBound = new Date(date);
  upperBound.setDate(date.getDate() + 15);

  try {
    return await prisma.events.findMany({
      where: {
        start_time: {
          gte: lowerBound,
          lte: upperBound,
        }
      },
    });
  } catch (error) {
    logger.error({ message: "Error fetching events", error: error.stack });
  }
};

/**
 * Find all the events for a specific month
 * @async
 * @param {Date} date - the date to search for
 * @returns {Object} list of events
 */
const getEventsByWeek = async (date = new Date()) => {
  let lowerBound = new Date(date);
  lowerBound.setDate(date.getDate() - 4);

  let upperBound = new Date(date);
  upperBound.setDate(date.getDate() + 5);

  try {
    const events =  await prisma.events.findMany({
      where: {
        start_time: {
          gte: lowerBound,
          lte: upperBound,
        }
      },
    });

    return events;
  } catch (error) {
    logger.error({ message: "Error fetching events", error: error.stack });
  }
};

  /**
   * Find all events for a speciic start and end range
   * @param {Date} start 
   * @param {Date} end 
   * @returns {Object} list of events
   */
const getEventsByRange = async (start, end) => {
  if (isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
    logger.error({ message: "Invalid date format" });
    throw new Error("Invalid date format");
  }
  if (!(start instanceof Date)) {
    start = new Date(start);
  }
  if (!(end instanceof Date)) {
    end = new Date(end);
  }
  try {
    return await prisma.events.findMany({
      where: {
        start_time: {
          gte: start,
        },
        end_time: {
          lt: end,
        },
      },
    });
  } catch (error) {
    logger.error({ message: "Error fetching events", error: error.stack });
  }
};

/**
 * Creates an event and persists it to the database
 * @param {Object} event - event payload from the request
 * @returns {Promise<Object>} promise that resolves to the created event object
 */
const createEvent = async (event) => {
  // // Presently, location is a string from the event created form. If this is the correct implementation, we will have to look up the location id.
  // var location = await prisma.locations.findUnique({
  //   where: {
  //     room_number: event.location,
  //   },
  // });
  // var locationId = location ? location.location_id : null;

  // event.location_id = locationId;
  if (!event) {
    throw new Error('Event is null or undefined');
  }

  const requiredProperties = ['location_id', 'start_time', 'end_time'];

  for (const property of requiredProperties) {
    if (!event[property]) {
      throw new Error(`Required property ${property} is null or undefined`);
    }
  }

  try {
    return await prisma.events.create({
      data: {
        location_id: event.location_id,
        start_time: event.start_time,
        end_time: event.end_time,
        summary: event.event_name,
        description: event.description,
        facilitator: event.facilitator,
      },
    });
  } catch (error) {
    logger.error({ message: "Error creating event", error: error.stack });
  }
};  

/**
 * Asynchronously deletes an event from the database.
 *
 * @param {number|string} event_id -id of event to delete
 * @returns {Promise<object>} a promise that resolves to the result of the delete operation
 */
const deleteEvent = async (event_id) => {
  try {
    var id = parseInt(event_id);

    return await prisma.events.delete({
      where: {
        event_id: id,
      },
    });
  } catch (error) {
    logger.error({ message: "Error deleting event", error: error.stack });
  }
}

module.exports = {
  getEventsByDate,
  getEventsByMonth,
  getEventsByWeek,
  getEventsByRange,
  createEvent,
  deleteEvent
};
