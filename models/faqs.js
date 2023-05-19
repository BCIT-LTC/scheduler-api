const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//retrieve faq for faq table
const getFaq = async () => {
  const faqs = await prisma.faqs.findMany();
  return faqs;
};

//add faqs to MySQL database
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

//delete faqs from MySQL database
const deleteFaq = async (id) => {
  const deletedFaq = await prisma.faqs.delete({
    where: { faqs_id: id },
  });
  console.log("Deleted Faq: ", deletedFaq);
  return deletedFaq;
};

//edit faqs from MySQL database
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
