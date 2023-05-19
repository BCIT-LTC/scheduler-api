const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userModel = {
    /**
     * finds a list of all the existing admins
     * @async
     * @returns array of users who are admins
     */
    findAdmins: async () => {
        try {
            return await prisma.users.findMany({
                where: { isAdmin: true },
            });
        } catch (error) {
            console.error("An error occurred while fetching admins:", error);
        }
    },
    /**
     * Find a specific user
     * @param {*} email
     * @async
     * @returns first/last name, email, and if the user is an admin
     */
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

    /**
     * Find a user by their id
     * @param {*} id - id of the user to find
     * @async
     * @returns first/last name, email, and if the user is an admin
     */
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

    /**
     * Add a new user to the database
     * @param {*} email - users email
     * @param {*} firstName - users first name
     * @param {*} lastName - users last name
     * @param {*} isAdmin - if the user is an admin
     * @param {*} eligibleAdmin - if the user is allowed to be an admin
     * @returns the user who was added
     */
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
    /**
     * update an existing users admin status
     * @param {*} email - email of user to update
     * @param {*} isAdmin - admin status of the user
     * @async
     * @returns possible error message
     */
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
