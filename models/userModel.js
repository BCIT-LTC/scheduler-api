const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function logError (context, error) {
    const errorMessage = `${new Date()} - Error in ${context}: ${error.message}\n`;
    if (process.env.Node_ENV === 'development') {
        fs.appendFileSync('error_log.txt', errorMessage);
    } else {
        console.error(error);
    }
}

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
            logError(`Error fetching admins: ${error.message}`);
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
            logError(`Error fetching user with email ${email}: ${error.message}`);
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
            logError(`Error adding user: ${error.message}`);
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
                logError(errorMessage)
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
            logError(`Error updating admin: ${error.message}`);
            throw error;
        }
    },
};

module.exports = { prisma, userModel };
