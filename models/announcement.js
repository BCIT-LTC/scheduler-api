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
const getAnnouncement = async () => {
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
 * @param {Announcement} announcement - the announcement to add with title, description, email of the user who created it, and event_id
 * @returns {unknown}
 */
const addAnnouncement = async (announcement) => {
  try {
    return await prisma.announcement.create({
      data: {
        title: announcement.title,
        description: announcement.description,
        created_by: announcement.created_by,
        event_id: announcement.event_id,
      },
    });
  } catch (error) {
    logger.error({ message: " Error while adding an announcement", error: error.stack });
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
 * @returns {Object} the updated announcement
 */
const editAnnouncement = async(id, updatedTitle, updatedDescription, date) => {
    try {
        const editedAnnouncement = await prisma.announcement.update({
            where: { announcement_id: id },
            data: {
                title: updatedTitle,
                description: updatedDescription,
                date: date,
                last_updated: new Date(),
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