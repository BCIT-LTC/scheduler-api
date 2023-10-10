const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require('fs');

/**
 * Log the error based on the environment.
 * @param {string} context - Context where the error occurred.
 * @param {Error} error - The error object.
 */
function logError(context, error) {
  const errorMessage = `${new Date()} - Error in ${context}: ${error.message}\n`;
  if (process.env.NODE_ENV === "development") {
    fs.appendFileSync("error_log.txt", errorMessage);
  } else {
    console.error(errorMessage);
  }
}

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
    logError("seedAnnouncements", error);
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
    logError("seedFaqs", error);
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
    logError("seedDatabase", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase().then(r => console.log(r));
