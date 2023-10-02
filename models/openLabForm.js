const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Log an error to the console or to a file depending on the environment.
 * @param context
 * @param error
 */
const logError = (context, error) => {
    const errorMessage = `${new Date()} - Error in ${context}: ${error.message}\n`;
    if (process.env.Node_ENV === "development") {
        fs.appendFileSync("error_log.txt", errorMessage);
    } else {
        console.error(error);
    }
}

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
     */
    findMonth: async (date, year) => {
        if (!validateDate(date) || !validateYear(year)) {
            logError("Invalid date or year format", `Date: ${date}, Year: ${year}`);
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
            logError(
                "An error occurred while getting the calendar", error);
            throw error;
        }
    },

    /**
     * Updates the calendar with an array of open lab objects
     * @param {*} forms - Array of open lab objects to update
     * @returns results Results of update
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
            console.error(
                "An error occurred while updating the calendar:",
                error
            );
        }
    },
};

module.exports = dataForm;
