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
    const announcement = await prisma.announcement.findUnique({
      where: { announcement_id: parseInt(id) },
    });

    if (!announcement) {
      throw new Error(`No announcement found with id: ${id}`);
    }

    if (announcement.event_id) {
      const event = await prisma.event.findUnique({
        where: { event_id: announcement.event_id },
      });

      if (event) {
        announcement.event = event;
      }
    }

    return announcement;
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
const getAnnouncements = async () => {
  try {
    const announcements = await prisma.announcement.findMany();

    for (let announcement of announcements) {
      if (announcement.event_id) {
        const event = await prisma.event.findUnique({
          where: { event_id: announcement.event_id },
        });

        if (event) {
          announcement.event = event;
        }
      }
    }

    return announcements;
  } catch (error) {
    console.error("Error while fetching announcements:", error.stack);
    throw new Error("Error while fetching announcements");
  }
};

/**
 * Create an announcement
 *
 * @param {object} announcement - The announcement object
 * @returns {Promise<object>} - The added announcement object
 */
const createAnnouncement = async (announcement) => {
  const { title, description, created_by, event_id } = announcement;
  try {
    return await prisma.announcement.create({
      data: {
        title,
        description,
        creator: { connect: { email: created_by } },
        ...(event_id && {
          announcement_event: { connect: { event_id: parseInt(event_id) } }
        })
      },
    });
  } catch (error) {
    console.error("Error while adding an announcement:", error.stack);
    throw error;
  }
};

/**
 * Edits an announcement by its ID with new data
*
 * @param {object} announcement - The announcement object
 * @returns {Promise<object>} - The updated announcement object
*/
const updateAnnouncement = async (announcement) => {
  const { announcement_id, title, description, modified_by } = announcement;
  try {
    return await prisma.announcement.update({
      where: { announcement_id: parseInt(announcement_id) },
      data: {
        title,
        description,
        modifier: { connect: { email: modified_by } }
      },
    });
  } catch (error) {
    console.error("Error while editing an announcement:", error.stack);
    throw new Error("Error while editing an announcement");
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

module.exports = {
  getAnnouncementById,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
};
