const { parseArgs } = require("node:util");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);
const environment = process.env.NODE_ENV;

/**
 * CLI options for the seed script.
 */
const options = {
  environment: { type: "string" },
};

/**
 * Initial location data from seedData/locations.js
 */
const locations = require("./seedData/locations");

/**
 * Initial event data from seedData/events.js
 */
const events = require("./seedData/events");

/**
 * Seed initial announcement data.
 * @async
 * @returns {Object} seeded announcement data
 */
async function seedAnnouncements() {
  try {
    return await prisma.announcements.upsert({
      where: { announcements_id: 1 },
      update: {},
      create: {
        title: "Welcome!",
        description: "Welcome to the BSN OpenLab Scheduler!",
        date: new Date(),
      },
    });
  } catch (error) {
    logger.error({ message: "seedAnnouncements", error: error.stack });
    throw error;
  }
}

/**
 * Seed initial event data.
 * Multiple events included to test get by day, week, and month
 * @async
 * @return {Array} of seeded event data
 */
async function seedEvents() {
  try {
    const eventArrayHalf = Math.floor(events.length / 2);

    // Half of the events will have the 1st location
    for (let i = 0; i <= eventArrayHalf; i++) {
      const event = events[i];
      await prisma.events.upsert({
        where: { event_id: event.event_id },
        update: {},
        create: {
          start_time: new Date(event.start_time),
          end_time: new Date(event.end_time),
          summary: event.summary,
          description: event.description,
          created: new Date(),
          status: event.status,
          location: {
            connect: { location_id: locations[0].location_id },
          },
        },
      });
    }

    // Half of the events will have the 2nd location
    for (let i = eventArrayHalf + 1; i < events.length; i++) {
      const event = events[i];
      await prisma.events.upsert({
        where: { event_id: event.event_id },
        update: {},
        create: {
          start_time: new Date(event.start_time),
          end_time: new Date(event.end_time),
          summary: event.summary,
          description: event.description,
          status: event.status,
          location: {
            connect: { location_id: locations[1].location_id },
          },
        },
      });
    }
  } catch (error) {
    logger.error({ message: "seedEvents", error: error.stack });
    throw error;
  }
}

/**
 * Seed initial location data.
 * @async
 * @return {Object} seed location data
 */
async function seedLocations() {
  try {
    // Insert locations from seedData/locations.json into the database
    for (let i = 0; i < locations.length; i++) {
      await prisma.locations.upsert({
        where: { location_id: locations[i].location_id },
        update: {},
        create: {
          room_number: locations[i].room_number,
        },
      });
    }
  } catch (error) {
    logger.error({ message: "seedLocations", error: error.stack });
    throw error;
  }
}

/**
 * Seed the database with initial data.
 * @async
 */
async function seedDatabase() {
  const {
    values: { environment },
  } = parseArgs({ options });

  try {
    switch (environment) {
      case "development":
        // add development AND production seed data
        // seedAnnouncements();
        seedLocations();
        seedEvents();
        break;
      case "test":
        // add test seed data, running all test scripts at once

        break;
      default:
        // add production seed data (defaults to production if no environment is specified)
        seedLocations();
        break;
    }
  } catch (error) {
    logger.error({ message: "seedDatabase", error: error.stack });
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase().then((r) => console.log(r));
