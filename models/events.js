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

module.exports = {
  getEventsByDate,
  getEventsByMonth,
  getEventsByWeek,
  getEventsByRange
};
