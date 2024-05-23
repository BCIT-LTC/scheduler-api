// Import Prisma client and logger
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require("../logger");
const logger = createLogger(module);
const { createEvent, updateEvent } = require("./events");

//////////////////////
// Helper Functions //
//////////////////////

/**
 * Compares the date range and frequency data of 2 Series.
 * @param {Object} existingSeries - Existing series data from the database.
 * @param {Object} newSeries - New series data to compare against the existing data.
 * @returns {boolean} - Returns true if the properties are equal, otherwise false.
 */
const areSeriesDatesAndFrequenciesEqual = (existingSeries, newSeries) => {
  const startDate = new Date(newSeries.start_date);
  const endDate = new Date(newSeries.end_date);

  return (
    existingSeries.start_date.getTime() === startDate.getTime() &&
    existingSeries.end_date.getTime() === endDate.getTime() &&
    JSON.stringify(existingSeries.recurrence_frequency_weeks) ===
      JSON.stringify(newSeries.recurrence_frequency_weeks) &&
    JSON.stringify(existingSeries.recurrence_frequency_days) ===
      JSON.stringify(newSeries.recurrence_frequency_days)
  );
};

/**
 * Maps event IDs to the series data.
 *
 * @param {Object} seriesData - The series data from the request body.
 * @param {Array<number>} eventIds - An array of event IDs to map to the series data.
 * @returns {Object} - The modified series data with mapped event IDs.
 */
const mapEventsToSeries = (seriesData, eventIds) => {
  const seriesDataMappedWithEvents = {
    ...seriesData,
    events: eventIds.map((eventId) => ({
      event_id: eventId,
    })),
  };

  return seriesDataMappedWithEvents;
};

////////////////////
// Main Functions //
////////////////////

// Required properties for both Create and Update functions
const requiredPropertiesCommon = [
  "series_title",
  "start_time",
  "end_time",
  "start_date",
  "end_date",
];

/**
 * Retrieve a series by its ID
 * @async
 * @param {number} seriesId - the ID of the series to retrieve
 * @returns {Promise<Object>} promise that resolves to the series object
 */
const getSeries = async (seriesId) => {
  try {
    const series = await prisma.series.findUnique({
      where: { series_id: seriesId },
      include: { events: true },
    });

    if (!series) {
      throw new Error(`Series with id ${seriesId} not found`);
    }
    return series;
  } catch (error) {
    logger.error({
      message: `Error fetching series with id ${seriesId}`,
      error: error.stack,
    });
    throw error;
  }
};

/**
 *  Retrieve all events associated with a specific series
 * @async
 * @param {number} seriesId - The identifier for the series
 * @returns {Promise<Array>} promise that resolves to the list of events
 */
const getSeriesEvents = async (seriesId) => {
  if (!seriesId) {
    throw new Error("Series identifier is null or undefined");
  }

  try {
    const series = await prisma.series.findUnique({
      where: { series_id: seriesId },
      include: { events: true },
    });

    if (!series) {
      throw new Error(`Series with id ${seriesId} not found`);
    }

    return series.events;
  } catch (error) {
    logger.error({
      message: "Error fetching series events",
      error: error.stack,
    });
    throw error;
  }
};

/**
 * Creates a new Series entry in the database.
 * @async
 * @param {Object} series - The series data payload from the request. The object includes:
 *                          - location_id: Location of the series. Must be an existing location_id in 'Location' table of database.
 *                          - series_title: Title of the series.
 *                          - description: Description of what the series entails.
 *                          - facilitator: Name or identifier of the person facilitating the series.
 *                          - start_time: Start time for each session in the series (HH:MM or HH:MM:SS).
 *                          - end_time: End time for each session in the series (HH:MM or HH:MM:SS).
 *                          - start_date: The start date of the series (YYYY-MM-DD).
 *                          - end_date: The end date of the series (YYYY-MM-DD).
 *                          - status: The current status of the series (default: 'TENTATIVE').
 *                          - creator: User responsible for creation. Must be an existing email in 'User' table of database.
 *                          - recurrence_frequency_weeks: Frequency of recurrence measured in weeks.
 *                          - recurrence_frequency_days: An array of integers representing the days of the week on which events should occur (1 for Monday, 5 for Friday).
 *                          - events: Array of event objects, each containing an 'event_id' that links to specific events.
 * @returns {Promise<Object>} A promise that resolves to the created series object as stored in the database.
 */
const createSeries = async (series) => {
  if (!series) {
    throw new Error("Series is null or undefined");
  }

  const requiredProperties = [...requiredPropertiesCommon, "created_by"];

  for (const property of requiredProperties) {
    if (!series[property]) {
      throw new Error(`Required property ${property} is null or undefined`);
    }
  }
  try {
    return await prisma.series.create({
      data: {
        location: { connect: { location_id: series.location_id } },
        series_title: series.series_title,
        summary: series.summary,
        description: series.description,
        facilitator: series.facilitator,
        start_time: new Date(series.start_date + "T" + series.start_time),
        end_time: new Date(series.end_date + "T" + series.end_time),
        start_date: new Date(series.start_date),
        end_date: new Date(series.end_date),
        status: series.status,
        location: { connect: { location_id: series.location_id } },
        creator: { connect: { email: series.created_by } },
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

/**
 * Automatically generates event entries within a specified date range based on given recurrence rules.
 * @async
 * @param {Object} series - The series data payload from the request. The object includes:
 *                          - series_title: Title of the series.
 *                          - description: Description of what the series entails.
 *                          - facilitator: Name or identifier of the person facilitating the series.
 *                          - start_time: Start time for each session in the series (HH:MM or HH:MM:SS).
 *                          - end_time: End time for each session in the series (HH:MM or HH:MM:SS).
 *                          - start_date: The start date of the series (YYYY-MM-DD).
 *                          - end_date: The end date of the series (YYYY-MM-DD).
 *                          - status: The current status of the series (default: 'TENTATIVE').
 *                          - location_id: Location of the series. Must be an existing location_id in 'Location' table of database.
 *                          - creator: User responsible for creation. Must be an existing email in 'User' table of database.
 *                          - recurrence_frequency_weeks: Frequency of recurrence measured in weeks.
 *                          - recurrence_frequency_days: An array of integers representing the days of the week on which events should occur (1 for Monday, 5 for Friday).
 * @returns {Promise<Array<number>>} A promise that resolves to an array of event IDs (integers) of the created events.
 */
const autoGenerateEvents = async (series) => {
  if (!series) {
    throw new Error("Argument cannot be null!");
  }

  const {
    start_date,
    end_date,
    recurrence_frequency_weeks,
    recurrence_frequency_days,
  } = series;

  let currentDate = new Date(start_date);
  currentDate.setDate(currentDate.getDate() - currentDate.getDay()); // Set to Sunday of previous week
  const startDateInitial = new Date(start_date + "T00:00:00");
  const endDateTerminal = new Date(end_date + "T23:59:59");

  const weekIncrement = 7 * recurrence_frequency_weeks;

  const startDateAndTime = start_date + "T" + series.start_time;
  const startTimeHours = new Date(startDateAndTime).getHours();
  const startTimeMinutes = new Date(startDateAndTime).getMinutes();
  const startTimeSeconds = new Date(startDateAndTime).getSeconds();

  const endDateAndTime = end_date + "T" + series.end_time;
  const endTimeHours = new Date(endDateAndTime).getHours();
  const endTimeMinutes = new Date(endDateAndTime).getMinutes();
  const endTimeSeconds = new Date(endDateAndTime).getSeconds();

  let eventIds = [];

  while (currentDate <= endDateTerminal) {
    for (let dayOfWeek of recurrence_frequency_days) {
      const eventDate = new Date(currentDate);
      eventDate.setDate(eventDate.getDate() + dayOfWeek);

      if (eventDate >= startDateInitial && eventDate <= endDateTerminal) {
        const startTime = new Date(eventDate);
        startTime.setHours(startTimeHours, startTimeMinutes, startTimeSeconds);

        const endTime = new Date(eventDate);
        endTime.setHours(endTimeHours, endTimeMinutes, endTimeSeconds);

        const newEventData = {
          ...series, // Spreads all properties from series
          summary: series.series_title,
          start_time: startTime,
          end_time: endTime,
        };

        try {
          const createdEvent = await createEvent(newEventData);
          console.log("Event Created:", createdEvent);
          eventIds.push(createdEvent.event_id);
        } catch (error) {
          logger.error({
            message:
              "Error creating event on [" +
              eventDate.toISOString().split("T")[0] +
              "]", // Only retrieve date
            error: error.stack,
          });
        }
      }
    }

    const nextWeek = currentDate.getDate() + weekIncrement;
    currentDate.setDate(nextWeek);
  }

  return eventIds;
};

/**
 * Update a Series entry in the database. Will also update Events tied to the Series entry.
 * @async
 * @param {Object} series - The series data payload from the request. The object includes:
 *                          - series_title: Title of the series.
 *                          - description: Description of what the series entails.
 *                          - facilitator: Name or identifier of the person facilitating the series.
 *                          - start_time: Start time for each session in the series (HH:MM or HH:MM:SS).
 *                          - end_time: End time for each session in the series (HH:MM or HH:MM:SS).
 *                          - start_date: The start date of the series (YYYY-MM-DD).
 *                          - end_date: The end date of the series (YYYY-MM-DD).
 *                          - status: The current status of the series (default: 'TENTATIVE').
 *                          - location_id: Location of the series. Must be an existing location_id in 'Location' table of database.
 *                          - modifier: User responsible for modification. Must be an existing email in 'User' table of database.
 *                          - recurrence_frequency_weeks: Frequency of recurrence measured in weeks.
 *                          - recurrence_frequency_days: An array of integers representing the days of the week on which events should occur (1 for Monday, 5 for Friday).
 * @returns {Promise<Object>} A promise that resolves to the updated series object as stored in the database.
 */
const updateSeries = async (series) => {
  if (!series) {
    throw new Error("Argument cannot be null!");
  }

  const requiredProperties = [...requiredPropertiesCommon, "modified_by"];
  for (const property of requiredProperties) {
    if (!series[property]) {
      throw new Error(`Required property ${property} is null or undefined`);
    }
  }

  const existingSeries = await (async () => {
    try {
      const seriesData = await prisma.series.findUnique({
        where: { series_id: series.series_id },
      });
      if (!seriesData) {
        throw new Error(`Series with ID [${series.series_id}] not found`);
      }
      return seriesData;
    } catch (error) {
      logger.error({
        message: `Error finding series: ${error.message}`,
        error: error.stack,
      });
      throw new Error(`Error finding series: ${error.message}`);
    }
  })();

  try {
    const updatedSeries = await prisma.series.update({
      where: { series_id: existingSeries.series_id },
      data: {
        series_title: series.series_title,
        description: series.description,
        facilitator: series.facilitator,
        start_time: new Date(series.start_date + "T" + series.start_time),
        end_time: new Date(series.end_date + "T" + series.end_time),
        start_date: new Date(series.start_date),
        end_date: new Date(series.end_date),
        status: series.status,
        location: { connect: { location_id: series.location_id } },
        modifier: { connect: { email: series.modified_by } },
        recurrence_frequency_weeks: series.recurrence_frequency_weeks,
        recurrence_frequency_days: series.recurrence_frequency_days,
        events: {
          connect: series.events.map((event) => ({ event_id: event.event_id })),
        },
      },
    });
    return updatedSeries;
  } catch (error) {
    logger.error({
      message: `Error updating series: ${error.message}`,
      error: error.stack,
    });
    throw new Error(`Error updating series: ${error.message}`);
  }
};

/**
 * Updates all events associated with a Series.
 *
 * @param {Object} series - The series data containing updates for associated events.
 * @returns {Promise<string>} - A promise that resolves to a message indicating the number of successfully updated events.
 * @throws {Error} - Throws an error if the series argument is null or if any event update fails.
 */
const updateSeriesEvents = async (series) => {
  if (!series) {
    throw new Error("Argument cannot be null!");
  }

  try {
    // Find all events associated with this series
    const events = await prisma.event.findMany({
      where: { series_id: series.series_id },
    });

    console.log(events);

    let updatedEventIds = []; // To store IDs of successfully updated events

    // Loop through each event and update
    for (const event of events) {
      // Extract the date from event to keep it the same for new Date object
      const startDate = event.start_time.toISOString().split("T")[0];
      const endDate = event.end_time.toISOString().split("T")[0];
      const updatedEventData = {
        ...series,
        event_id: event.event_id,
        summary: series.series_title,
        start_time: startDate + "T" + series.start_time,
        end_time: endDate + "T" + series.end_time,
      };

      // Update each event, throw error immediately if one fails
      const updatedEvent = await updateEvent(updatedEventData);
      console.log("Event Updated:", updatedEvent);
      updatedEventIds.push(updatedEvent.event_id); // Store successful update IDs
    }

    return `Events updated: ${updatedEventIds.length}`; // Return count of successfully updated events
  } catch (error) {
    logger.error({
      message: `Error updating events for series [${series.series_id}]: ${error.message}`,
      error: error.stack,
    });
    throw error; // Rethrowing the error to exit the process on failure
  }
};

/**
 * Deletes all events associated with a series.
 * @async
 * @param {number} series_id - The ID of the series to delete events for.
 * @throws {Error} Throws an error if the series ID is null or undefined.
 */
const autoDeleteEvents = async (series_id) => {
  const id = series_id;
  try {
    const events = await prisma.event.findMany({
      where: {
        series_id: id,
      },
    });

    for (const event of events) {
      await prisma.event.delete({
        where: {
          event_id: event.event_id,
        },
      });
    }
  } catch (error) {
    logger.error({
      message: `Error deleting events for series ${id}`,
      error: error.stack,
    });
  }
};

/**
* Delete a series from the database
* @async
* @param {number} id - series id to delete
* @returns {Promise<Object>} promise that resolves to the deleted series object
*/
const deleteSeries = async (id) => {
  try {
    const series_id = parseInt(id);
    const series = await prisma.series.findUnique({
      where: { series_id: series_id },
    });
    if (!series) {
      throw new Error(`Series with id ${series_id} not found`);
    }
    return await prisma.series.delete({
      where: {
        series_id: series_id,
      },
    });
  } catch (error) {
    logger.error({ message: "Error deleting series", error: error.stack });
    throw error;
  }
};

// Export functions
module.exports = {
  areSeriesDatesAndFrequenciesEqual,
  mapEventsToSeries,
  getSeries,
  getSeriesEvents,
  createSeries,
  autoGenerateEvents,
  updateSeries,
  updateSeriesEvents,
  deleteSeries,
  autoDeleteEvents,
};
