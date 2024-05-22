const { PrismaClient } = require("@prisma/client");
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

  updateUserRole: async (email, newRole) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      if (user.role === newRole) {
        throw new Error(`User ${email} already has the role of ${newRole}`);
      }
      return await prisma.user.update({
        where: { email },
        data: { role: newRole },
      });
    } catch (error) {
      throw new Error(`Error updating user's role for ${email}: ${error.message}`);
    }
  },
};

module.exports = { prisma, userModel };
