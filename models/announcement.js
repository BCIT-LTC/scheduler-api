const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Retrieves an announcement by its ID
 *
 * @param {number} id - The ID of the announcement
 * @returns {Promise<object>} - The announcement object
 */
const getAnnouncementById = async (id) => {
  try {
    return await prisma.announcement.findUnique({
      where: { announcement_id: parseInt(id) },
    });
  } catch (error) {
    console.error("Error while fetching an announcement by id:", error.stack);
    throw new Error("Error while fetching an announcement by id");
  }
};

/**
 * Retrieves all announcements
 *
 * @returns {Promise<Array<object>>} - An array of announcement objects
 */
const getAnnouncement = async () => {
  try {
    return await prisma.announcement.findMany();
  } catch (error) {
    console.error("Error while fetching announcements:", error.stack);
    throw new Error("Error while fetching announcements");
  }
};

/**
 * Adds an announcement
 *
 * @param {object} announcement - The announcement object
 * @returns {Promise<object>} - The added announcement object
 */
const addAnnouncement = async (announcement) => {
  try {
    return await prisma.announcement.create({
      data: announcement,
    });
  } catch (error) {
    console.error("Error while adding an announcement:", error.stack);
    throw error;
  }
};

/**
 * Deletes an announcement by its ID
 *
 * @param {number} id - The ID of the announcement
 * @returns {Promise<object>} - The deleted announcement object
 */
const deleteAnnouncement = async (id) => {
  try {
    return await prisma.announcement.delete({
      where: { announcement_id: parseInt(id) },
    });
  } catch (error) {
    console.error("Error while deleting an announcement:", error.stack);
    throw new Error("Error while deleting an announcement");
  }
};

/**
 * Edits an announcement by its ID with new data
 *
 * @param {number} id - The ID of the announcement
 * @param {string} title - The title of the announcement
 * @param {string} description - The description of the announcement
 * @param {string} modified_by - The user who modified the announcement
 * @returns {Promise<object>} - The updated announcement object
 */
const editAnnouncement = async (id, title, description, modified_by) => {
  try {
    return await prisma.announcement.update({
      where: { announcement_id: parseInt(id) },
      data: { title, description, modified_by },
    });
  } catch (error) {
    console.error("Error while editing an announcement:", error.stack);
    throw new Error("Error while editing an announcement");
  }
};

module.exports = {
  getAnnouncementById,
  getAnnouncement,
  addAnnouncement,
  deleteAnnouncement,
  editAnnouncement,
};
