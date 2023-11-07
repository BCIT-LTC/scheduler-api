const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require('../logger'); // Ensure the path is correct
const logger = createLogger(module);

const userModel = {
    /**
     * finds a list of all the existing users
     * @async
     * @returns array of users
     */
    listAllUsers: async () => {
        try {
            return await prisma.users.findMany({
                where: { isActive: true },
            });
        } catch (error) {
            logger.error({message:`Error fetching users: ${error.message}`, error: error.stack});
            throw error;
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
            logger.error({message:`Error fetching user with email ${email}: ${error.message}`,error: error.stack});
            throw error;
        }
    },

    /**
     * Find a user by their id
     * @param {*} id - id of the user to find
     * @async
     * @returns first/last name, email, and if the user is an admin
     */
    // findById: async (id) => {
    //     try {
    //         return await prisma.users.findUnique({
    //             where: { id },
    //         });
    //     } catch (error) {
    //         console.error(
    //             `An error occurred while fetching user with ID ${id}:`,
    //             error
    //         );
    //     }
    // },
    // Section commented out because it is not used anywhere in the codebase.
    /**
     * Add a new user to the database
     * @param {*} email - users email
     * @param {*} firstName - users first name
     * @param {*} lastName - users last name
     * @param {*} isAdmin - if the user is an admin
     * @param {*} eligibleAdmin - if the user is allowed to be an admin
     * @returns the user who was added
     * @async
     */
    addUser: async (email, firstName, lastName, isAdmin, eligibleAdmin) => {
        try {
            const current = await prisma.users.findUnique({
                where: { email },
            });
            return await prisma.users.upsert({
                where: { email },
                update: {
                    firstName,
                    lastName,
                    eligibleAdmin,
                    isAdmin: eligibleAdmin && current?.isAdmin,
                },
                create: {
                    email,
                    firstName,
                    lastName,
                    isAdmin,
                    eligibleAdmin,
                },
            });
        } catch (error) {
            logger.error({message:`Error adding user: ${error.message}`, error: error.stack});
            throw error;
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
            if ( current && !current.eligibleAdmin && isAdmin && current.firstName !== "N/A"
            ) {
                const errorMessage = `User ${email} is not eligible to be an admin`;
                logger.error({error:errorMessage})
                throw new Error(errorMessage);
            }
            await prisma.users.upsert({
                where: { email },
                update: { isAdmin },
                create: {
                    email,
                    isAdmin,
                    firstName: "N/A",
                    lastName: "N/A",
                },
            });
        } catch (error) {
            logger.error({message:`Error updating admin: ${error.message}`, error: error.stack});
            throw error;
        }
    },
};

module.exports = { prisma, userModel };
