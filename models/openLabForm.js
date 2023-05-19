const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dataForm = {
    /**
     * Find the open labs in a month, given the month and year
     * @param {*} date - month of data to find
     * @param {*} year - year of data to find
     * @returns {Object} array of open lab objects from the month
     */
    findMonth: (date, year) => {
        const month = (new Date(date).getMonth() + 1)
            .toString()
            .padStart(2, "0");
        console.log(year);
        const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-${month}-31T23:59:59.999Z`);

        try {
            const calendar = prisma.calendar.findMany({
                where: {
                    date: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
            });
            return calendar;
        } catch (error) {
            console.log(
                "An error ocurred while getting the calendar: " + error
            );
        }
    },

    /**
     *
     * @param {*} forms - array of open lab objects to update
     * @returns results of update
     */
    updateCalendar: async (forms) => {
        try {
            return await Promise.all(
                forms.map(async (form) => {
                    const date = new Date(form.date);
                    date.setUTCHours(0, 0, 0, 0); // Set the time component to 00:00:00.000
                    if (form.calendar_id === undefined) form.calendar_id = -1;
                    return await prisma.calendar.upsert({
                        where: { calendar_id: form.calendar_id },
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
