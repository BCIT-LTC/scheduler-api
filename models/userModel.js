const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userModel = {
  findAdmins: () => {
    return prisma.users.findMany({
      where: { isAdmin: true }
    });
  },
  findOne: (email) => {
    return prisma.users.findUnique({
      where: { email },
    });
  },
  findById: (id) => {
    return prisma.users.findUnique({
      where: { id },
    });
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
          isAdmin: (eligibleAdmin && current.isAdmin)
        },
        create: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          isAdmin: isAdmin,
          eligibleAdmin: eligibleAdmin
        },
      });
      console.log("User added successfully");
      return user;
    } catch (error) {
      console.log("Error: " + error);
      throw error;
    }
  },
  updateAdmin: async (email, isAdmin) => {
    try {
      const current = await prisma.users.findUnique({
        where: { email },
      });
      if (current != null && !current.eligibleAdmin && isAdmin && current.firstName != "N/A") {
        return "Ineligible user";
      }
      await prisma.users.upsert({
        where: { email: email },
        update: {
          isAdmin: isAdmin
        },
        create: {
          email: email,
          isAdmin: isAdmin,
          firstName: 'N/A',
          lastName: "N/A"
        }
      })
    } catch (error) {
      console.log("Error: " + error);
      throw error;
    }
  }
};

module.exports = { prisma, userModel };
