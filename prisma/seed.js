const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);
const environment = process.env.NODE_ENV;

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
    return await prisma.announcement.upsert(
      {
        where: { announcement_id: 1 },
        update: {},
        create: {
          title: 'Website Maintenance',
          description: 'OpenLab Scheduler website will be down for maintenance on Sunday, May 26th, 2024 from 00:00 to 06:00 PST.',
          // created_by: 'Jasica Munday',
          created_at: new Date('2024-04-27T08:14:55'),
          // modified_by: 'Jasica Munday',
          last_modified: new Date('2024-05-01T08:20:31')
        },
      },
      {
        where: { announcement_id: 2 },
        update: {},
        create: {
          title: 'Statutory Holiday: Victoria Day',
          description: 'BCIT will be closed on May 20th, 2024 for Statutory Holiday: Victoria Day.',
          // created_by: 'Jasica Munday',
          created_at: new Date('2024-04-24T09:32:12'),
          // modified_by: 'Jasica Munday',
          last_modified: new Date('2024-04-24T09:32:12')
        },
      }
    );
  } catch (error) {
    logger.error({ message: "seedAnnouncements", error: error.stack });
    throw error;
  }
}

/**
 * Seed initial superuser data.
 * @async
 * @returns {Object} seeded superuser data
 */
async function seedSuperuser() {
  try {
    await prisma.user.upsert({
      where: { email: process.env.SUPERUSER },
      update: {},
      create: {
        email: process.env.SUPERUSER,
        first_name: "",
        last_name: "",
        saml_role: "",
        app_roles: [Role.admin],
        department: "",
        is_active: true,
      },
    });
  } catch (error) {
    logger.error({ message: "seedSuperuser", error: error.stack });
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
      await prisma.event.upsert({
        where: { event_id: event.event_id },
        update: {},
        create: {
          start_time: new Date(event.start_time),
          end_time: new Date(event.end_time),
          summary: event.summary,
          description: event.description,
          facilitator: event.facilitator,
          created_at: new Date(),
          last_modified: new Date(),
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
      await prisma.event.upsert({
        where: { event_id: event.event_id },
        update: {},
        create: {
          start_time: new Date(event.start_time),
          end_time: new Date(event.end_time),
          summary: event.summary,
          description: event.description,
          facilitator: event.facilitator,
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
      await prisma.location.upsert({
        where: { location_id: locations[i].location_id },
        update: {},
        create: {
          room_location: locations[i].room_location,
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
  try {
    switch (environment) {
      case "development":
        // add development AND production seed data
        await seedAnnouncements();
        await seedLocations();
        await seedEvents();
        await seedSuperuser();
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
