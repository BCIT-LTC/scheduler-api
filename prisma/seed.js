const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const logger = require("../logger")(module);
const environment = process.env.NODE_ENV;

/**
 * Initial user data from seedData/users.js
 */
const { dev_users, superuser } = require("./seedData/users");


/**
 * Initial location data from seedData/locations.js
 */
const locations = require("./seedData/locations");

/**
 * Initial event data from seedData/events.js
 */
const events = require("./seedData/events");

/**
 * Initial annoucement data from seedData/announcements.js
 */
const announcements = require("./seedData/announcements");

/**
 * Seed initial announcement data.
 * @async
 * @returns {Object} seeded announcement data
 */
async function seedAnnouncements() {
  try {
    for (let i = 0; i < announcements.length; i++) {
      const announcement = announcements[i];
      await prisma.announcement.upsert(
        {
          where: { announcement_id: announcement.announcement_id },
          update: {},
          create: {
            title: announcement.title,
            description: announcement.description,
            // created_by: 'Jasica Munday',
            created_at: announcement.created_at,
            // modified_by: 'Jasica Munday',
            last_modified: announcement.last_modified
          },
        }
      );
    }
  } catch (error) {
    logger.error({ message: "seedAnnouncements", error: error.stack });
    throw error;
  }
}

/**
 * Seed initial users data including superuser.
 * @async
 * @returns {Object} seeded users data
 */
async function seedUsers(users) {
  try {

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          saml_role: user.saml_role,
          app_roles: user.app_roles,
          department: user.department,
          is_active: user.is_active,
          created_at: new Date(user.created_at),
        },
        create: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          saml_role: user.saml_role,
          app_roles: user.app_roles,
          department: user.department,
          is_active: user.is_active,
          created_at: new Date(user.created_at),
        },
      });
    }
  } catch (error) {
    logger.error({ message: "seedUsers", error: error.stack });
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
          event_location_id: { connect: { location_id: locations[0].location_id } },
          // location_name: { connect: { room_location: locations[0].room_location } },
          room_location: locations[0].room_location,
          creator: { connect: { email: process.env.SAML_SUPERUSER } },
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
          event_location_id: { connect: { location_id: locations[1].location_id } },
          // location_name: { connect: { room_location: locations[1].room_location } },
          room_location: locations[0].room_location,
          creator: { connect: { email: process.env.SAML_SUPERUSER } },
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
  console.log("Seeding database for environment:", environment);
  try {
    switch (environment) {
      case "production":
        // add production seed data
        console.log("Applying production seed data");
        console.log("for superuser:", superuser[0].email);
        await seedUsers(superuser);
        break;
      case "development":
        // add development seed data
        console.log("Development seed data");
        await seedUsers(dev_users);
        await seedLocations();
        await seedEvents();
        await seedAnnouncements();
        break;
      case "test":
        console.log("test seed data");
        // add test seed data, running all test scripts at once
        break;
      default:
        console.log("Default seed data");
        break;
    }
    console.log("Database seeding finished.");
  } catch (error) {
    logger.error({ message: "seedDatabase", error: error.stack });
  } finally {
    console.log("Database seed command finished.");
    await prisma.$disconnect();
  }
}

seedDatabase().then((r) => { if (r) console.log(r) });
