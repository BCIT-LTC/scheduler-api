const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dataForm = {
    findMonth: (date, year) => {
        const month = (new Date(date).getMonth() + 1)
            .toString()
            .padStart(2, "0");
        console.log(year);
        const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-${month}-31T23:59:59.999Z`);

        return prisma.calendar.findMany({
            where: {
                date: {
                    gte: startDate,
                    lt: endDate,
                },
            },
        });
    },
    updateCalendar: (forms) => {
        return Promise.all(
            forms.map((form) => {
                const date = new Date(form.date);
                date.setUTCHours(0, 0, 0, 0); // Set the time component to 00:00:00.000
                console.log(form);
                if (!form.calendar_id) form.calendar_id = -1;
                return prisma.calendar.upsert({
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
    },
};

module.exports = dataForm;
