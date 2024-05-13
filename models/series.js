// Import Prisma client and logger
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require("../logger");
const logger = createLogger(module);

/**
 *  Create a Series entry in the database
 * @async
 * @param {Object} series - series payload from the request
 * @returns {Promise<Object>} promise that resolves to the created event object
 */
const createSeries = async (series) => {
  if (!series) {
    throw new Error("Series is null or undefined");
  }

  const requiredProperties = ['start_time', 'end_time', 'start_date', 'end_date'];

  for (const property of requiredProperties) {
    if (!series[property]) {
      throw new Error(`Required property ${property} is null or undefined`);
    }
  }

  try {
    return await prisma.series.create({
      data: {
        series_title: series.series_title,
        description: series.description,
        facilitator: series.facilitator,
        start_time: new Date(series.start_time),
        end_time: new Date(series.end_time),
        start_date: new Date(series.start_date),
        end_date: new Date(series.end_date),
        status: series.status,
        recurrence_frequency_weeks: series.recurrence_frequency_weeks,
        recurrence_frequency_days: series.recurrence_frequency_days,
        events: {
          connect: series.events.map((event) => ({ event_id: event.event_id })),
        },
      },
    });
  } catch (error) {
    logger.error({ message: "Error creating series", error: error.stack });
  }
};

// Export functions
module.exports = {
  createSeries,
};
