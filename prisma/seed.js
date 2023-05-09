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

    // to be deleted
    const defaultUser = await prisma.users.upsert({
        where: { userid: 1 },
        update: {},
        create: {
            email: "test@test.com",
            password: await bcrypt.hash("test", 10),
            isAdmin: true,
        },
    });
    console.log({ first_announcement });
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
