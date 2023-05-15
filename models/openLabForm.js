const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dataForm = {
    findMonth: (date) => {
        const month = (new Date(date).getMonth() + 1)
            .toString()
            .padStart(2, "0");

        const startDate = new Date(`2023-${month}-01T00:00:00.000Z`);
        const endDate = new Date(`2023-${month}-31T23:59:59.999Z`);

        return prisma.calendar.findMany({
            where: {
                date: {
                    gt: startDate,
                    lt: endDate,
                },
            },
        });
    },
    updateCalendar: (forms) => {
        return Promise.all(
            forms.map((form) => {
                const date = new Date(
                    form.date.replace(/T/, " ").replace(/Z/, "000")
                );
                return prisma.calendar.create({
                    data: {
                        date,
                        start_time: form["start-time"],
                        end_time: form["end-time"],
                        facilitator: form["facilitator"],
                        room: form["room"],
                        stat: form["stat"],
                    },
                });
            })
        );
    },

    updateOpenLabDay: (form) => {
        const date = new Date(form.date.replace(/T/, " ").replace(/Z/, "000"));
        return prisma.calendar.update({
            where: { calendar_id: form.calendar_id },
            data: {
                date,
                start_time: form["start-time"],
                end_time: form["end-time"],
                facilitator: form["facilitator"],
                room: form["room"],
                stat: form["stat"],
            },
        });
    },
};

module.exports = dataForm;
