const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//retrieve announcements for announcement table
const getAnnouncement = async () => {
    const announcements = await prisma.announcements.findMany();
    return announcements;
};

//add announcements to MySQL database
const addAnnouncement = async (title, description, date) => {
    const announcement = await prisma.announcement.create({
        data: {
            title,
            description,
            date,
        },
    });
    return announcement;
};

//delete announcements from MySQL database
const deleteAnnouncement = async (id) => {
    const deletedAnnouncement = await prisma.announcements.delete({
        where: { id },
    });
    console.log("Deleted Announcement: ", deletedAnnouncement);
    return deletedAnnouncement;
};

module.exports = {
    getAnnouncement,
    addAnnouncement,
    deleteAnnouncement,
};
