const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const first_announcement = await prisma.announcements.upsert({
    where: { announcements_id: 1 },
    update: {},
    create: {
        title: 'Welcome!',
        description: 'Welcome to the BSN OpenLab Scheduler!',
        date: new Date()
    },
  })
  console.log({ first_announcement })
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
