const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


/**
 * Find all the freqently asked questions
 * @date 2023-05-23 - 1:45:42 a.m.
 *
 * @async
 * @returns {Object} list of faqs
 */
const getFaq = async () => {
  const faqs = await prisma.faqs.findMany();
  return faqs;
};

/**
 * Add a new question to the db
 * @param {*} question
 * @param {*} answer
 * @param {*} id to possibly update
 * @returns the results
 */
const addFaq = async (question, answer, id = -1) => {
  const faq = await prisma.faqs.upsert({
    where: { faqs_id: id },
    update: {
      question: question,
      answer: answer,
    },
    create: {
      question: question,
      answer: answer,
    },
  });
  return faq;
};

/**
 * Delete a faq
 * @param {*} id of faq to delete
 * @returns  results
 */
const deleteFaq = async (id) => {
  const deletedFaq = await prisma.faqs.delete({
    where: { faqs_id: id },
  });
  console.log("Deleted Faq: ", deletedFaq);
  return deletedFaq;
};

/**
 * edit a faz
 * @param {*} id to update
 * @param {*} updatedQuestion new question
 * @param {*} updatedAnswer new answer
 * @returns
 */
const editFaq = async (id, updatedQuestion, updatedAnswer) => {
  const editedFaq = await prisma.faqs.update({
    where: { faqs_id: id },
    data: {
      question: updatedQuestion,
      answer: updatedAnswer,
    },
  });
  console.log("Edited Faq: ", editedFaq);
  return editedFaq;
};

module.exports = {
  getFaq,
  addFaq,
  deleteFaq,
  editFaq,
};
