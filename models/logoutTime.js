const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const saveLogoutTime = async (email, logoutTime) => {
    const updateLogTime = await prisma.users.update({
        where: {
            email: email,
        },
        data: { logoutTime: logoutTime },
    });
    return updateLogTime;
};

const logoutTime = async (email) => {
    const logoutTime = await prisma.users.findUnique({
        where: {
            email: email,
        },
        select: {
            logoutTime: true,
        },
    });

    return logoutTime;
};

module.exports = { saveLogoutTime, logoutTime };
