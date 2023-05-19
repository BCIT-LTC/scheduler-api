const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function main() {
  const first_announcement = await prisma.announcements.upsert({
    where: { announcements_id: 1 },
    update: {},
    create: {
      title: "Welcome!",
      description: "Welcome to the BSN OpenLab Scheduler!",
      date: new Date(),
    },
  });

  const first_faq = await prisma.faqs.upsert({
    where: { faqs_id: 1 },
    update: {},
    create: {
      question: "What is Open Lab?",
      answer:
        "Open Lab is a space for BSN students to practice their psychomotor skills",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
