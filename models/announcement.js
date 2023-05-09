const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//retrieve announcements for announcement table
const getAnnouncement = async () => {
    const announcements = await prisma.announcements.findMany();
    return announcements;
};

//add announcements to MySQL database
const addAnnouncement = async (title, description, date, id = -1) => {
    const announcement = await prisma.announcements.upsert({
        where: { announcements_id: id },
        update: {
            title: title,
            description: description,
            date: date,
        },
        create: {
            title: title,
            description: description,
            date: date,
        },
    });
    return announcement;
};

//delete announcements from MySQL database
const deleteAnnouncement = async (id) => {
    const deletedAnnouncement = await prisma.announcements.delete({
        where: { announcements_id: id },
    });
    console.log("Deleted Announcement: ", deletedAnnouncement);
    return deletedAnnouncement;
};

module.exports = {
    getAnnouncement,
    addAnnouncement,
    deleteAnnouncement,
};
