/**
 * @namespace seriesModel
 * @description model for handling series requests.
 */

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
 * Extracts the date portion (YYYY-MM-DD) from a Date object in UTC.
 * @memberof seriesModel
 * @function
 * @param {Date} dateTimeObject - The Date object from which to extract the date.
 * @returns {string} - The date portion in the format 'YYYY-MM-DD'.
 */
const extractDateString = (dateTimeObject) => {
  const year = dateTimeObject.getUTCFullYear();
  const month = String(dateTimeObject.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateTimeObject.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Compares the date range and frequency data of 2 Series.
 * @memberof seriesModel
 * @function
 * @param {Object} existingSeries - Existing series data from the database.
 * @param {Object} newSeries - New series data to compare against the existing data.
 * @returns {boolean} - Returns true if the properties are equal, otherwise false.
 */
const areSeriesDatesAndFrequenciesEqual = (existingSeries, newSeries) => {
  const oldStartDate = extractDateString(new Date(existingSeries.start_date));
  const oldEndDate = extractDateString(new Date(existingSeries.end_date));
  const newStartDate = extractDateString(new Date(newSeries.start_date));
  const newEndDate = extractDateString(new Date(newSeries.end_date));

  return (
    oldStartDate === newStartDate &&
    oldEndDate === newEndDate &&
    JSON.stringify(existingSeries.recurrence_frequency_weeks) ===
    JSON.stringify(newSeries.recurrence_frequency_weeks) &&
    JSON.stringify(existingSeries.recurrence_frequency_days) ===
    JSON.stringify(newSeries.recurrence_frequency_days)
  );
};

/**
 * Maps event IDs to the series data.
 * @memberof seriesModel
 * @function
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

/**
 * Combines the date from one Date object with the time from another Date object.
 * @memberof seriesModel
 * @function
 * @param {Date} dateTimeObjectWithDate - The Date object containing the date.
 * @param {Date} dateTimeObjectWithTime - The Date object containing the time.
 * @returns {Date} A new Date object with the combined date and time.
 */
const combineDateAndTime = (dateTimeObjectWithDate, dateTimeObjectWithTime) => {
  const year = dateTimeObjectWithDate.getFullYear();
  const month = dateTimeObjectWithDate.getMonth();
  const day = dateTimeObjectWithDate.getDate();

  const hours = dateTimeObjectWithTime.getHours();
  const minutes = dateTimeObjectWithTime.getMinutes();
  const seconds = dateTimeObjectWithTime.getSeconds();
  const perfectDateTimeObject = new Date(
    year,
    month,
    day,
    hours,
    minutes,
    seconds
  );

  return perfectDateTimeObject;
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
 * @memberof seriesModel
 * @function
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
 * @memberof seriesModel
 * @function
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
 * @memberof seriesModel
 * @function
 * @async
 * @param {Object} series - The series data payload from the request. The object includes:
 *                          - location_id: Location of the series. Must be an existing location_id in 'Location' table of database.
 *                          - series_title: Title of the series.
 *                          - description: Description of what the series entails.
 *                          - facilitator: Name or identifier of the person facilitating the series.
 *                          - start_time: The Date object containing the start time.
 *                          - end_time: The Date object containing the end time.
 *                          - start_date: The Date object containing the start date.
 *                          - end_date: The Date object containing the end date.
 *                          - status: The current status of the series (default: 'TENTATIVE').
 *                          - creator: User responsible for creation. Must be an existing email in 'User' table of database.
 *                          - recurrence_frequency_weeks: Frequency of recurrence measured in weeks.
 *                          - recurrence_frequency_days: An array of integers representing the days of the week on which events should occur (1 for Monday, 5 for Friday).
 *                          - events: Array of event objects, each containing an 'event_id' that links to specific events.
 * @returns {Promise<Object>} A promise that resolves to the created series object as stored in the database.
 */
const createSeries = async (seriesFields) => {
  if (!seriesFields) {
    throw new Error("Argument cannot be null!");
  }

  const requiredProperties = [...requiredPropertiesCommon, "created_by"];
  for (const property of requiredProperties) {
    if (!seriesFields[property]) {
      throw new Error(`Required property ${property} is null or undefined`);
    }
  }

  try {
    const perfectStartData = combineDateAndTime(
      new Date(seriesFields.start_date),
      new Date(seriesFields.start_time)
    );
    const perfectEndData = combineDateAndTime(
      new Date(seriesFields.end_date),
      new Date(seriesFields.end_time)
    );

    let eventsQueueBatch = await autoGenerateEvents(seriesFields);

    return await prisma.series.create({
      data: {
        series_title: seriesFields.series_title,
        summary: seriesFields.summary,
        description: seriesFields.description,
        facilitator: seriesFields.facilitator,
        start_time: perfectStartData,
        end_time: perfectEndData,
        start_date: perfectStartData,
        end_date: perfectEndData,
        status: seriesFields.status,
        location: { connect: { location_id: seriesFields.location_id } },
        creator: { connect: { email: seriesFields.created_by } },
        modifier: { connect: { email: seriesFields.created_by } },
        recurrence_frequency_weeks: seriesFields.recurrence_frequency_weeks,
        recurrence_frequency_days: seriesFields.recurrence_frequency_days,
        events: {
          connect: eventsQueueBatch
        },
      },
    });

  } catch (error) {
    logger.error({ message: "Error creating series", error: error.stack });
    throw new Error("Error creating series: " + error.stack);
  }
};

/**
 * Automatically generates event entries within a specified date range based on given recurrence rules.
 * @memberof seriesModel
 * @function
 * @async
 * @param {Object} series - The series data payload from the request. The object includes:
 *                          - series_title: Title of the series.
 *                          - description: Description of what the series entails.
 *                          - facilitator: Name or identifier of the person facilitating the series.
 *                          - start_time: The Date object containing the start time.
 *                          - end_time: The Date object containing the end time.
 *                          - start_date: The Date object containing the start date.
 *                          - end_date: The Date object containing the end date.
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
    start_time,
    end_time,
    start_date,
    end_date,
    recurrence_frequency_weeks,
    recurrence_frequency_days,
  } = series;

  let weekscounter = 1;
  let currentDate = new Date(start_date);
  const startDate = new Date(start_date);
  if (startDate.getDay() == 0) { //if the start day is sunday delay counting by 1 week
    weekscounter = 0;
  }
  const endDate = new Date(end_date);
  let eventsQueueBatch = [];
  
  while (currentDate <= new Date(end_date)) {
    if (weekscounter > recurrence_frequency_weeks) {
      break;
    }

    if (recurrence_frequency_days.includes(currentDate.getDay())) {

      const startTime = new Date(currentDate);
      startTime.setHours(new Date(start_time).getHours(), new Date(start_time).getMinutes(), new Date(start_time).getSeconds());
      const endTime = new Date(currentDate);
      endTime.setHours(new Date(end_time).getHours(), new Date(end_time).getMinutes(), new Date(end_time).getSeconds());

      const newEventData = {
        ...series, // Spreads all properties from series
        summary: series.series_title,
        start_time: startTime,
        end_time: endTime,
      };

      let createEventData = {
        data: {
          location: { connect: { location_id: newEventData.location_id } },
          start_time: new Date(newEventData.start_time),
          end_time: new Date(newEventData.end_time),
          summary: newEventData.summary,
          description: newEventData.description,
          facilitator: newEventData.facilitator,
          status: newEventData.status,
        }
      }

      if (newEventData.modified_by) {
        createEventData.data = {
          ...createEventData.data,
          modifier: { connect: { email: newEventData.modified_by } }
        }
      }
      if (newEventData.created_by) {
        createEventData.data = {
          ...createEventData.data,
          creator: { connect: { email: newEventData.created_by } }
        }
      }

      try {
        const createdEvent = await prisma.event.create(
          createEventData
        );

        eventsQueueBatch.push(createdEvent)

      } catch (error) {
        logger.error({
          message: "Error creating event on [" + currentDate.toISOString().split("T")[0] + "],",
          error: error.stack,
        });
      }
    }

    if (currentDate.getDay() == 0) { //if the day is sunday start count for another week
      weekscounter++;
    }

    currentDate.setDate(currentDate.getDate() + 1); //increment the date by 1 day
  }

  return eventsQueueBatch;

};

/**
 * Update a Series entry in the database. Will also update Events tied to the Series entry.
 * @memberof seriesModel
 * @function
 * @async
 * @param {Object} series - The series data payload from the request. The object includes:
 *                          - series_title: Title of the series.
 *                          - description: Description of what the series entails.
 *                          - facilitator: Name or identifier of the person facilitating the series.
 *                          - start_time: The Date object containing the start time.
 *                          - end_time: The Date object containing the end time.
 *                          - start_date: The Date object containing the start date.
 *                          - end_date: The Date object containing the end date.
 *                          - status: The current status of the series (default: 'TENTATIVE').
 *                          - location_id: Location of the series. Must be an existing location_id in 'Location' table of database.
 *                          - modifier: User responsible for modification. Must be an existing email in 'User' table of database.
 *                          - recurrence_frequency_weeks: Frequency of recurrence measured in weeks.
 *                          - recurrence_frequency_days: An array of integers representing the days of the week on which events should occur (1 for Monday, 5 for Friday).
 * @returns {Promise<Object>} A promise that resolves to the updated series object as stored in the database.
 */
const updateSeries = async (id, seriesFields) => {
  if (!seriesFields) {
    throw new Error("Argument cannot be null!");
  }

  const requiredProperties = [...requiredPropertiesCommon, "modified_by"];
  for (const property of requiredProperties) {
    if (!seriesFields[property]) {
      throw new Error(`Required property ${property} is null or undefined`);
    }
  }

  try {
    const perfectStartData = combineDateAndTime(
      new Date(seriesFields.start_date),
      new Date(seriesFields.start_time)
    );
    const perfectEndData = combineDateAndTime(
      new Date(seriesFields.end_date),
      new Date(seriesFields.end_time)
    );

    const deleteEvents = await prisma.event.deleteMany({
      where: { series_id: seriesFields.series_id },
    })

    let eventsQueueBatch = await autoGenerateEvents(seriesFields);

    const updatedSeries = await prisma.series.update({
      where: { series_id: id },
      data: {
        series_title: seriesFields.series_title,
        description: seriesFields.description,
        facilitator: seriesFields.facilitator,
        start_time: perfectStartData,
        end_time: perfectEndData,
        start_date: perfectStartData,
        end_date: perfectEndData,
        status: seriesFields.status,
        location: { connect: { location_id: seriesFields.location_id } },
        modifier: { connect: { email: seriesFields.modified_by } },
        recurrence_frequency_weeks: seriesFields.recurrence_frequency_weeks,
        recurrence_frequency_days: seriesFields.recurrence_frequency_days,
        events: {
          connect: eventsQueueBatch
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
 * @memberof seriesModel
 * @function
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

    let updatedEventIds = []; // To store IDs of successfully updated events

    const { start_time, end_time } = series;

    const startTimeHours = new Date(start_time).getHours();
    const startTimeMinutes = new Date(start_time).getMinutes();
    const startTimeSeconds = new Date(start_time).getSeconds();

    const endTimeHours = new Date(end_time).getHours();
    const endTimeMinutes = new Date(end_time).getMinutes();
    const endTimeSeconds = new Date(end_time).getSeconds();

    // Loop through each event and update
    for (const event of events) {
      const startData = new Date(event.start_time);
      startData.setHours(startTimeHours, startTimeMinutes, startTimeSeconds);

      const endData = new Date(event.end_time);
      endData.setHours(endTimeHours, endTimeMinutes, endTimeSeconds);

      const updatedEventData = {
        ...series,
        event_id: event.event_id,
        summary: series.series_title,
        start_time: startData,
        end_time: endData,
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
 * @memberof seriesModel
 * @function
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
 * @memberof seriesModel
 * @function
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
