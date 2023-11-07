const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require('../logger'); // Ensure the path is correct
const logger = createLogger(module);


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
    logger.error({message:"seedAnnouncements", error: error.stack});
    throw error;
  }
}

/**
 * Seed initial faq data.
 * @async
 * @returns {Object} seeded faq data
 */
async function seedFaqs() {
  try {
    return await prisma.faqs.upsert({
      where: { faqs_id: 1 },
      update: {},
      create: {
        question: "What is Open Lab?",
        answer: "Open Lab is a space for BSN students to practice their psychomotor skills",
      },
    });
  } catch (error) {
    logger.error({message:"seedFaqs", error: error.stack});
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
    await seedFaqs();
    console.log("Seeding completed successfully.");
  } catch (error) {
    logger.error({message:"seedDatabase", error: error.stack});
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase().then(r => console.log(r));
