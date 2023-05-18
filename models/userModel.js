const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userModel = {
    findAdmins: async () => {
        try {
            return await prisma.users.findMany({
                where: { isAdmin: true },
            });
        } catch (error) {
            console.error("An error occurred while fetching admins:", error);
        }
    },

    findOne: async (email) => {
        try {
            return await prisma.users.findUnique({
                where: { email },
            });
        } catch (error) {
            console.error(
                `An error occurred while fetching user with email ${email}:`,
                error
            );
        }
    },

    findById: async (id) => {
        try {
            return await prisma.users.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error(
                `An error occurred while fetching user with ID ${id}:`,
                error
            );
        }
    },

    addUser: async (email, firstName, lastName, isAdmin, eligibleAdmin) => {
        try {
            const current = prisma.users.findUnique({
                where: { email },
            });
            const user = await prisma.users.upsert({
                where: { email },
                update: {
                    firstName: firstName,
                    lastName: lastName,
                    eligibleAdmin: eligibleAdmin,
                    isAdmin: eligibleAdmin && current.isAdmin,
                },
                create: {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    isAdmin: isAdmin,
                    eligibleAdmin: eligibleAdmin,
                },
            });
            console.log("User added successfully");
            return user;
        } catch (error) {
            console.log("Error: " + error);
        }
    },
    updateAdmin: async (email, isAdmin) => {
        try {
            const current = await prisma.users.findUnique({
                where: { email },
            });
            if (
                current != null &&
                !current.eligibleAdmin &&
                isAdmin &&
                current.firstName != "N/A"
            ) {
                return "Ineligible user";
            }
            await prisma.users.upsert({
                where: { email: email },
                update: {
                    isAdmin: isAdmin,
                },
                create: {
                    email: email,
                    isAdmin: isAdmin,
                    firstName: "N/A",
                    lastName: "N/A",
                },
            });
        } catch (error) {
            console.log("Error: " + error);
        }
    },
};

module.exports = { prisma, userModel };
