const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dataForm = {
    findMonth: (month) => {
        return prisma.calendar.findMany({
            where: { date: { contains: month } },
        });
    },
    updateCalendar: (forms) => {
        return Promise.all(
            forms.map((form) => {
                return prisma.calendar.upsert({
                    where: { date: form.date },
                    create: {
                        date: form.date.replace(/T/, " ").replace(/Z/, "000"),
                        start_time: form["start-time"],
                        end_time: form["end-time"],
                        facilitator: form["facilitator"],
                        room: form["room"],
                        stat: form["stat"],
                    },
                    update: {
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
        return prisma.calendar.update({
            where: { calendar_id: form.calendar_id },
            data: {
                date: form.date.replace(/T/, " ").replace(/Z/, "000"),
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
