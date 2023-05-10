const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userModel = {
  findEligable: () => {
    return prisma.users.findMany({
      where: { eligibleAdmin: true }
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
      const user = await prisma.users.upsert({
        where: { email },
        update: {
          firstName: firstName,
          lastName: lastName,
          eligibleAdmin: eligibleAdmin,
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
  updateAdmin: async (list, isAdmin) => {
    console.log(list);
    console.log(isAdmin);
    try {
      await prisma.users.updateMany({
        where: { email: { in: list } },
        data: {
          isAdmin: isAdmin
        }
      })
    } catch (error) {
      console.log("Error: " + error);
      throw error;
    }
  }
};

module.exports = { prisma, userModel };
