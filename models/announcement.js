const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


/**
 * Retrieve a list of all the annoucements.
 * @date 2023-05-17 - 10:41:51 p.m.
 *
 * @async
 * @returns {Object} list of all the a annoucements.
 */
const getAnnouncement = async () => {
    try {
        const announcements = await prisma.announcements.findMany();
        return announcements;
    } catch (error) {
        console.error("An error occurred while fetching announcements:", error);
    }
};


/**
 * Add an announcement to the database.
 * @date 2023-05-17 - 10:42:41 p.m.
 *
 * @async
 * @param {*} title - announcement title
 * @param {*} description - details about the announcement
 * @param {*} date - date the announcement was made
 * @param {number} [id=-1] id of the new announcement, if its an update
 * @returns {unknown}
 */
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


/**
 * Delete an announcement given an id
 * @date 2023-05-17 - 10:43:52 p.m.
 *
 * @async
 * @param {*} id of the announcement to delete
 * @returns {Object} deleted announcement
 */
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


/**
 * Update an announcement with its id
 * @date 2023-05-17 - 10:44:51 p.m.
 *
 * @async
 * @param {*} id - id of announcement to update
 * @param {*} updatedTitle - the new title
 * @param {*} updatedDescription - the new description
 * @returns {Object} the updated announcement
 */
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
