const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require('../logger'); // Ensure the path is correct
const logger = createLogger(module);


/**
 * Retrieve a list of all the announcements.
 * @date 2023-05-17 - 10:41:51 p.m.
 * @async
 * @returns {Object} list of all the announcements.
 */
const getAnnouncement = async () => {
    try {
        return await prisma.announcements.findMany();
    } catch (error) {
        logger.error({message:"Error while fetching announcements", error: error.stack});
    }
};


/**
 * Add an announcement to the database.
 * @date 2023-05-17 - 10:42:41 p.m.
 * @async
 * @param {*} title - announcement title
 * @param {*} description - details about the announcement
 * @param {*} date - date the announcement was made
 * @param {number} [id=-1] id of the new announcement, if it's an update
 * @returns {unknown}
 */
const addAnnouncement = async (title, description, date, id = -1) => {
    try {
        return await prisma.announcements.upsert({
            where: { announcements_id: id },
            update: {
                title,
                description,
                date,
            },
            create: {
                title,
                description,
                date,
            },
            });
    } catch (error) {
    logger.error({ message: " Error while adding an announcement", error: error.stack });
    }
};


/**
 * Delete an announcement given an id
 * @date 2023-05-17 - 10:43:52 p.m.
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
        logger.error({message:"Error while deleting an announcement",error: error.stack});
    }
};


/**
 * Update an announcement with its id
 * @date 2023-05-17 - 10:44:51 p.m.
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
        logger.error({message:"Error while editing an announcement",error: error.stack});
    }
};

module.exports = {
    getAnnouncement,
    addAnnouncement,
    deleteAnnouncement,
    editAnnouncement,
};
