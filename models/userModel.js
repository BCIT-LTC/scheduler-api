const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLogger = require("../logger"); // Ensure the path is correct
const logger = createLogger(module);

const userModel = {
  /**
   * finds a list of all the existing users
   *
   * @async
   * @returns array of users
   */
  listAllUsers: async () => {
    try {
      return await prisma.user.findMany({
        where: { is_active: true },
      });
    } catch (error) {
      logger.error({
        message: `Error fetching users: ${error.message}`,
        error: error.stack,
      });
      throw error;
    }
  },
  /**
   * Find a specific user
   *
   * @param {*} email
   * @async
   * @returns first/last name, email, and if the user is an admin
   */
  findOne: async (email) => {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      logger.error({
        message: `Error fetching user with email ${email}: ${error.message}`,
        error: error.stack,
      });
      throw error;
    }
  },

  /**
   * Find a user by their id
   *
   * @param {*} id - id of the user to find
   * @async
   * @returns first/last name, email, and if the user is an admin
   */
  // findById: async (id) => {
  //     try {
  //         return await prisma.user.findUnique({
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
   *
   * @param {*} email - users email
   * @param {*} first_name - users first name
   * @param {*} last_name - users last name
   * @param {*} saml_role - users saml role
   * @param {*} app_roles - users app roles
   * @param {*} department - users department
   * @param {*} is_active - users active status
   * @returns the user who was added
   * @async
   */
  addUser: async (
    email,
    first_name,
    last_name,
    saml_role,
    app_roles,
    department,
    is_active
  ) => {
    try {
      return await prisma.user.upsert({
        where: { email },
        update: {
          first_name: first_name,
          last_name: last_name,
          saml_role: saml_role,
          app_roles: app_roles,
          department: department,
          is_active: is_active,
        },
        create: {
          email,
          first_name,
          last_name,
          saml_role,
          app_roles,
          department,
          is_active,
        },
      });
    } catch (error) {
      logger.error({
        message: `Error adding user: ${error.message}`,
        error: error.stack,
      });
      throw error;
    }
  },
  /**
   * update an existing users admin status
   *
   * @param {*} email - email of user
   * @param {*} newRole - new role of user
   * @async
   * @returns possible error message
   */
  updateUserRole: async (email, newRole) => {
    try {
      const user = await prisma.user.findUnique({
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
      return await prisma.user.update({
        where: { email },
        data: { role: newRole },
      });
    } catch (error) {
      logger.error({
        message: `Error updating user's role: ${error.message}`,
        error: error.stack,
      });
      throw error;
    }
  },
};

module.exports = { prisma, userModel };
