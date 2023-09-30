const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

/**
 * Log an error to the console or to a file depending on the environment.
 * @param context
 * @param error
 */
function logError(context,error) {
    const errorMessage = `${new Date()} - Error in ${context}: ${error.message}\n`;
    if (process.env.Node_ENV === "development") {
        fs.appendFileSync("error_log.txt", errorMessage);
    } else {
        console.error(error);
    }
}

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
        logError("Fetching announcements",error);
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
    logError("Adding an announcement",error);
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
        logError("Deleting an announcement",error);
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
        logError("Editing an announcement",error);
    }
};

module.exports = {
    getAnnouncement,
    addAnnouncement,
    deleteAnnouncement,
    editAnnouncement,
};
