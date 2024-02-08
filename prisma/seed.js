const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);
const fs = require("fs");

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
    const seedPath = "./prisma/seedData/events.json";
    try {
        fs.readFile(seedPath, "utf8", async(err, data) => {
            if (err) {
                console.error("Error reading the file:", err);
                return;
            }

            // 'data' is the content of the file as a string
            const jsonData = JSON.parse(data);

            // Insert data into the database
            for (const event of jsonData) {
                await prisma.events.upsert({
                    where: { event_id: event.event_id },
                    update: {},
                    create: {
                        start_time: new Date(event.start_time),
                        end_time: new Date(event.end_time),
                        summary: event.summary,
                        description: event.description,
                        status: event.status,
                    },
                });
            }
        });
    } catch (error) {
        logger.error({ message: "seedEvents", error: error.stack });
        throw error;
    }
}

/**
 * Seed the database with initial data.
 * @async
 */
async function seedDatabase() {
    try {
        await seedAnnouncements();
        await seedEvents();
        console.log("Seeding completed successfully.");
    } catch (error) {
        logger.error({ message: "seedDatabase", error: error.stack });
    } finally {
        await prisma.$disconnect();
    }
}

seedDatabase().then((r) => console.log(r));