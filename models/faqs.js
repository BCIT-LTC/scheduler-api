const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require('../logger'); // Ensure the path is correct
const logger = createLogger(module);


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
    logger.error({message:"Error fetching faqs", error: error.stack});
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
    logger.error({message:"Error adding faq", error: error.stack});
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
    logger.error({message:"Error deleting faq", error: error.stack});
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
    logger.error({message:"Error editing faq", error: error.stack});
  }
};

module.exports = {
  getFaq,
  addFaq,
  deleteFaq,
  editFaq,
};
