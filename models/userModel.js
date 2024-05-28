const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

const userModel = {
  listAllUsers: async () => {
    try {
      return await prisma.user.findMany({
        where: { is_active: true },
      });
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  },

  findOne: async (email) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user with email ${email}: ${error.message}`);
    }
  },

  addUser: async (
    email, first_name, last_name, saml_role, app_roles, department, is_active
  ) => {
    try {
      return await prisma.user.upsert({
        where: { email },
        update: {
          first_name, last_name, saml_role, app_roles, department, is_active,
        },
        create: {
          email, first_name, last_name, saml_role, app_roles, department, is_active,
        },
      });
    } catch (error) {
      throw new Error(`Error adding user ${email}: ${error.message}`);
    }
  },

  updateUserRole: async (user_id, newRoles) => {
    try {
      // Check if all role in newRoles are valid roles in the Role enum
      const validRoles = Object.values(Role);
      const invalidRoles = newRole.filter((role) => !validRoles.includes(role));
      if (invalidRoles.length > 0) {
        throw new Error(`Invalid role(s): ${invalidRoles.join(", ")}`);
      }

      // Find the user by user_id
      const user = await prisma.user.findUnique({
        where: { user_id },
      });

      // Check if the user exists
      if (!user) {
        throw new Error(`User with user_id ${user_id} not found`);
      }
      
      return await prisma.user.update({
        where: {user_id},
        data: {
          app_roles: newRoles}, // Overwrite the users app_roles with the new roles
        });
    } catch (error) {
      throw new Error(`Error updating user's role for ${user_id}: ${error.message}`);
    }
  },
};

module.exports = { prisma, userModel };
