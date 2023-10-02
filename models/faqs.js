const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

/**
 * Log an error to the console or to a file depending on the environment.
 * @param context
 * @param error
 */
const logError = (context, error) => {
    const errorMessage = `${new Date()} - Error in ${context}: ${error.message}\n`;
    if (process.env.Node_ENV === "development") {
        fs.appendFileSync("error_log.txt", errorMessage);
    } else {
        console.error(error);
    }
}

/**
 * Find all the frequently asked questions
 * @date 2023-05-23 - 1:45:42 a.m.
 * @async
 * @returns {Object} list of faqs
 */
const getFaq = async () => {
  try {
    return await prisma.faqs.findMany();
  } catch (error) {
    logError("Error fetching faqs", error);
  }
};

/**
 * Add a new question to the db
 * @param {*} question
 * @param {*} answer
 * @param {*} id to possibly update
 * @returns the results
 * @async
 */
const addFaq = async (question, answer, id = -1) => {
  try {
    return await prisma.faqs.upsert({
      where: {faqs_id: id},
      update: { question, answer},
      create: { question, answer},
    });
  } catch (error) {
    logError("Error adding faq", error);
  }
};

/**
 * Delete a faq
 * @param {*} id of faq to delete
 * @returns  results
 * @async
 * @throws {Error} if the id is invalid
 */
const deleteFaq = async (id) => {
  try {
    const deletedFaq = await prisma.faqs.delete({
      where: {faqs_id: id},
    });
    console.log("Deleted Faq: ", deletedFaq);
    return deletedFaq;
  } catch (error) {
    logError("Error deleting faq", error);
  }
};

/**
 * edit a faz
 * @param {*} id to update
 * @param {*} updatedQuestion new question
 * @param {*} updatedAnswer new answer
 * @returns
 * @async
 * @throws {Error} if the id is invalid
 */
const editFaq = async (id, updatedQuestion, updatedAnswer) => {
  try {
  return await prisma.faqs.update({
    where: { faqs_id: id },
    data: { question: updatedQuestion, answer: updatedAnswer },
  });
} catch (error) {
    logError("Error editing faq", error);
  }
};

module.exports = {
  getFaq,
  addFaq,
  deleteFaq,
  editFaq,
};
