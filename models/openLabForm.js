const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require('../logger'); // Ensure the path is correct
const logger = createLogger(module);

/**
 * Validates the date format
 * @param date
 * @returns {boolean}
 */
function validateDate(date) {
    if (date === undefined) return false;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
}

/**
 * Validates the year format
 * @param year
 * @returns {boolean}
 */
function validateYear(year) {
    if (year === undefined) return false;
    const yearRegex = /^\d{4}$/;
    return yearRegex.test(year);
}

const dataForm = {
    /**
     * Find the open labs in a month, given the month and year
     * @param {*} date - Month of data to find
     * @param {*} year - Year of data to find
     * @returns {Object} Array of open lab objects from the month
     * @throws {Error} If the date or year is invalid
     * @async
     */
    findMonth: async (date, year) => {
        if (!validateDate(date) || !validateYear(year)) {
            logger.error({message:"Invalid date or year format", error: `Date: ${date}, Year: ${year}`});
            throw new Error("Invalid date or year");
        }
        const month = (new Date(date).getMonth() + 1).toString().padStart(2, "0");
        const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-${month}-31T23:59:59.999Z`);

        try {
            return await prisma.calendar.findMany({
                where: {
                    date: { gte: startDate, lt: endDate },
                },
            });
        } catch (error) {
            logger.error(
                {message:"An error occurred while getting the calendar", error: error.stack});
            throw error;
        }
    },

    /**
     * Updates the calendar with an array of open lab objects
     * @param {*} forms - Array of open lab objects to update
     * @returns results Results of update
     * @async
     * @throws {Error} If the date or year is invalid
     */
    updateCalendar: async (forms) => {
        try {
            return await Promise.all(
                forms.map(async (form) => {
                    const date = new Date(form.date);
                    date.setUTCHours(0, 0, 0, 0); // Set the time component to 00:00:00.000
                    const calendarId = form.calendar_id || -1;
                    return prisma.calendar.upsert({
                        where: {calendar_id: calendarId},
                        create: {
                            date,
                            start_time: form["start_time"],
                            end_time: form["end_time"],
                            facilitator: form["facilitator"],
                            room: form["room"],
                            stat: form["stat"],
                        },
                        update: {
                            start_time: form["start_time"],
                            end_time: form["end_time"],
                            facilitator: form["facilitator"],
                            room: form["room"],
                            stat: form["stat"],
                        },
                    });
                })
            );
        } catch (error) {
            logger.error({message:"An error occurred while updating the calendar", error: error.stack});
        }
    },
};

module.exports = dataForm;
