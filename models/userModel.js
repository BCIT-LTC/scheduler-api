const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userModel = {
    findOne: (email) => {
        return prisma.user.findUnique({
            where: { email },
        });
    },
    findById: (id) => {
        return prisma.user.findUnique({
            where: { id },
        });
    },
};

const addUser = async (email, isAdmin, eligibleAdmin, logoutTime) => {
    try {
        const user = await prisma.users.upsert({
            where: { email },
            update: {},
            create: {
                email: email,
                isAdmin: isAdmin,
                eligibleAdmin: eligibleAdmin,
                logoutTime: logoutTime,
            },
        });
        console.log("User added successfully");
        return user;
    } catch (error) {
        console.log("Error: " + error);
        throw error;
    }
};

module.exports = { prisma, userModel, addUser };
