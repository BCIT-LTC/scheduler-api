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
  try {
    return await prisma.events.findMany({
      where: {
        date: date,
      },
    });
  } catch (error) {
    logger.error({ message: "Error fetching events", error: error.stack });
  }
};
