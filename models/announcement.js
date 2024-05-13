const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require('../logger'); // Ensure the path is correct
const logger = createLogger(module);


/**
 * Retrieve a list of all the announcements.
 *
 * @date 2023-05-17 - 10:41:51 p.m.
 * @async
 * @returns {Object} list of all the announcements.
 */
const getAnnouncement = async() => {
    try {
        return await prisma.announcement.findMany();
    } catch (error) {
        logger.error({ message: "Error while fetching announcements", error: error.stack });
        throw error;
    }
};


/**
 * Add an announcement to the database.
 *
 * @date 2023-05-17 - 10:42:41 p.m.
 * @async
 * @param {*} title - announcement title
 * @param {*} description - details about the announcement
 * @param {*} date - date the announcement was made
 * @returns {unknown}
 */
const addAnnouncement = async(title, description, created_date) => {
    try {
        return await prisma.announcement.create({
            data: {
                title: title,
                description: description,
                created_at: created_date,
                created_by: null,
                last_modified: new Date(),
                modified_by: null,
                event_id: null,
            },
        });
    } catch (error) {
        logger.error({ message: "Error while adding an announcement", error: error.stack });
        throw error;
    }
};


/**
 * Delete an announcement given an id
 *
 * @date 2023-05-17 - 10:43:52 p.m.
 * @async
 * @param {*} id of the announcement to delete
 * @returns {Object} deleted announcement
 */
const deleteAnnouncement = async(id) => {
    try {
        const deletedAnnouncement = await prisma.announcement.delete({
            where: { announcement_id: id },
        });
        console.log("Deleted Announcement: ", deletedAnnouncement);
        return deletedAnnouncement;
    } catch (error) {
        logger.error({ message: "Error while deleting an announcement", error: error.stack });
        throw error;
    }
};


/**
 * Update an announcement with its id
 *
 * @date 2023-05-17 - 10:44:51 p.m.
 * @async
 * @param {*} id - id of announcement to update
 * @param {*} updatedTitle - the new title
 * @param {*} updatedDescription - the new description
 * @param date
 * @returns {Object} the updated announcement
 */
const editAnnouncement = async(id, updatedTitle, updatedDescription, last_modified) => {
    try {
        const editedAnnouncement = await prisma.announcement.update({
            where: { announcement_id: id },
            data: {
                title: updatedTitle,
                description: updatedDescription,
                last_modified: last_modified,
            },
        });
        console.log("Edited Announcement: ", editedAnnouncement);
        return editedAnnouncement;
    } catch (error) {
        logger.error({ message: "Error while editing an announcement", error: error.stack });
        throw error;
    }
};

module.exports = {
    getAnnouncement,
    addAnnouncement,
    deleteAnnouncement,
    editAnnouncement,
};