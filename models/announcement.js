const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//retrieve announcements for announcement table
const getAnnouncement = async () => {
    try {
        const announcements = await prisma.announcements.findMany();
        return announcements;
    } catch (error) {
        console.error("An error occurred while fetching announcements:", error);
    }
};

//add announcements to MySQL database
const addAnnouncement = async (title, description, date, id = -1) => {
    try {
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
    } catch (error) {
        console.error("An error occurred while adding an announcement:", error);
    }
};

//delete announcements from MySQL database
const deleteAnnouncement = async (id) => {
    try {
        const deletedAnnouncement = await prisma.announcements.delete({
            where: { announcements_id: id },
        });
        console.log("Deleted Announcement: ", deletedAnnouncement);
        return deletedAnnouncement;
    } catch (error) {
        console.error(
            "An error occurred while deleting an announcement:",
            error
        );
    }
};

//edit announcements from MySQL database
const editAnnouncement = async (id, updatedTitle, updatedDescription) => {
    try {
        const editedAnnouncement = await prisma.announcements.update({
            where: { announcements_id: id },
            data: {
                title: updatedTitle,
                description: updatedDescription,
            },
        });
        console.log("Edited Announcement: ", editedAnnouncement);
        return editedAnnouncement;
    } catch (error) {
        console.error(
            "An error occurred while editing an announcement:",
            error
        );
    }
};

module.exports = {
    getAnnouncement,
    addAnnouncement,
    deleteAnnouncement,
    editAnnouncement,
};
