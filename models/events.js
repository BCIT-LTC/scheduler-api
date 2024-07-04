/**
 * @namespace eventsModel
 * @description model for handling series requests.
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const logger = require("../logger")(module);

/**
 * Find an event by its id
 * @memberof eventsModel
 * @function
 * @async
 * @param {number} id - the id of the event
 * @returns {Object} the event object
 */
const getEventById = async (id) => {
  try {
    var eventId = parseInt(id);
    return await prisma.event.findUnique({
      where: {
        event_id: eventId,
      },
    });
  } catch (error) {
    logger.error({ message: "Error fetching event", error: error.stack });
  }
};

/**
 * Find all the events for a specific day
 * @memberof eventsModel
 * @function
 * @async
 * @param {Date} date - the date to search for
 * @returns {Object} list of events
 */
const getEventsByDate = async (date) => {
  var nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1); // Add one day to the date

  try {
    return await prisma.event.findMany({
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
 * @memberof eventsModel
 * @function
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
    return await prisma.event.findMany({
      where: {
        start_time: {
          gte: lowerBound,
          lte: upperBound,
        },
      },
    });
  } catch (error) {
    logger.error({ message: "Error fetching events", error: error.stack });
  }
};

/**
 * Find all the events for a specific month
 * @memberof eventsModel
 * @function
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
    const events = await prisma.event.findMany({
      where: {
        start_time: {
          gte: lowerBound,
          lte: upperBound,
        },
      },
    });

    return events;
  } catch (error) {
    logger.error({ message: "Error fetching events", error: error.stack });
  }
};

/**
 * Find all events for a speciic start and end range
 * @memberof eventsModel
 * @function
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
    return await prisma.event.findMany({
      where: {
        start_time: {
          gte: start,
        },
        end_time: {
          lt: end,
        },
      },
      include: {
        series: true,
        event_announcement: true,
      }
    });
  } catch (error) {
    logger.error({ message: "Error fetching events", error: error.stack });
  }
};

/**
 * Creates an event and persists it to the database
 * @memberof eventsModel
 * @function
 * @param {Object} event - event payload from the request
 * @returns {Promise<Object>} promise that resolves to the created event object
 */
const createEvent = async (event) => {
  if (!event) {
    throw new Error("Event is null or undefined");
  }

  const requiredProperties = ["location_id", "start_time", "end_time"];

  for (const property of requiredProperties) {
    if (!event[property]) {
      throw new Error(`Required property ${property} is null or undefined`);
    }
  }

  try {
    const createdEvent = await prisma.event.create({
      data: {
        location: { connect: { location_id: event.location_id } },
        start_time: new Date(event.start_time),
        end_time: new Date(event.end_time),
        summary: event.summary,
        description: event.description,
        facilitator: event.facilitator,
        status: event.status,
        creator: { connect: { email: event.created_by } },
      },
    });
    return createdEvent;
  } catch (error) {
    logger.error({ message: "Error creating event", error: error.stack });
    throw error;
  }
};

/**
 * Asynchronously deletes an event from the database.
 * @memberof eventsModel
 * @function
 * @param {number|string} event_id -id of event to delete
 * @returns {Promise<object>} a promise that resolves to the result of the delete operation
 */
const deleteEvent = async (event_id) => {
  try {
    var id = parseInt(event_id);

    return await prisma.event.delete({
      where: {
        event_id: id,
      },
    });
  } catch (error) {
    logger.error({ message: "Error deleting event", error: error.stack });
  }
};

/**
 * Update an existing event
 * @memberof eventsModel
 * @function
 * @param {Object} event - event to update
 * @returns {Promise<Object>} promise that resolves to the updated event object
 */
const updateEvent = async (event) => {
  try {
    const e = await prisma.event.findUnique({
      where: { event_id: event.event_id },
    });
    if (!e) {
      throw new Error(`Event with ID [${event.event_id}] not found`);
    }

    const location = await prisma.location.findUnique({
      where: {
        location_id: event.location_id,
      },
    });

    // Prepare the data object with conditional series handling
    const updateData = {
      location: { connect: { location_id: event.location_id } },
      start_time: new Date(event.start_time),
      end_time: new Date(event.end_time),
      summary: event.summary,
      description: event.description,
      facilitator: event.facilitator,
      modifier: { connect: { email: event.modified_by } },
    };

    // Disconnect the series if the series_id is not null
    if (event.series_id !== null) {
      updateData.series = { disconnect: true };
    }

    const updatedEvent = await prisma.event.update({
      where: { event_id: e.event_id },
      data: updateData,
    });

    return updatedEvent;
  } catch (error) {
    logger.error({
      message: `Error updating event: ${error.message}`,
      error: error.stack,
    });
    throw error;
  }
};

module.exports = {
  getEventById,
  getEventsByDate,
  getEventsByMonth,
  getEventsByWeek,
  getEventsByRange,
  createEvent,
  deleteEvent,
  updateEvent,
};
