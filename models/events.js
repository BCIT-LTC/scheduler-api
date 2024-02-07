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
const getEventsByDate = async(date) => {

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
 * @async
 * @param {Date} date - the date to search for
 * @returns {Object} list of events
 */
const getEventsByMonth = async (date) => {
  try {
    return await prisma.events.findMany({
      where: {
        start: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 15),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 15),
        }
      },
    });
  } catch (error) {
    logger.error({ message: "Error fetching events", error: error.stack });
  }
};

module.exports = {
  getEventsByDate,
  getEventsByMonth,
};
