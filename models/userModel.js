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
     * @param {*} role - users role
     * @param {*} school - users school
     * @param {*} program - users program
     * @param {*} isActive - users active status
     * @returns the user who was added
     * @async
     */
    addUser: async (email, firstName, lastName, role, school, program, isActive) => {
        try {
            return await prisma.users.upsert({
                where: { email },
                update: {
                    firstName: firstName,
                    lastName: lastName,
                    role: role,
                    school: school,
                    program: program,
                    isActive: isActive,
                },
                create: {
                    email,
                    firstName,
                    lastName,
                    role,
                    school,
                    program,
                    isActive,
                },
            });
        } catch (error) {
            logger.error({message:`Error adding user: ${error.message}`, error: error.stack});
            throw error;
        }
    },
    /**
     * update an existing users admin status
     * @param {*} email - email of user
     * @param {*} newRole - new role of user
     * @async
     * @returns possible error message
     */
    updateUserRole: async (email, newRole) => {
        try {
            const user = await prisma.users.findUnique({
                where: { email },
            });
            if (!user) {
                throw new Error(`User with email ${email} not found`);
            }
            // Check if there is an actual role change to avoid unnecessary database operations
            if (user.role === newRole) {
                throw new Error(`User ${email} already has the role of ${newRole}`);
            }
            // Perform the update
            return await prisma.users.update({
                where: { email },
                data: { role: newRole },
            });
        } catch (error) {
            logger.error({message:`Error updating user's role: ${error.message}`, error: error.stack});
            throw error;
        }
    },

};

module.exports = { prisma, userModel };
