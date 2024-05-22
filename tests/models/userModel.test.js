const { prisma, userModel } = require("../../models/userModel");

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
    prisma: mockPrisma,
  };
});

describe("Role Management Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listAllUsers", () => {
    it("should return all active users", async () => {
      const mockUsers = [
        { email: "user1@test.com", is_active: true },
        { email: "user2@test.com", is_active: true },
      ];
      prisma.user.findMany.mockResolvedValue(mockUsers);

      const users = await userModel.listAllUsers();

      expect(users).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { is_active: true },
      });
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });

    it("should throw an exception if fetching users fails", async () => {
      const error = new Error("Database error");
      prisma.user.findMany.mockRejectedValue(error);

      await expect(userModel.listAllUsers()).rejects.toThrow(
        `Error fetching users: ${error.message}`
      );
    });
  });

  describe("findOne", () => {
    it("should return a user by email", async () => {
      const mockUser = {
        email: "user@test.com",
        first_name: "Test",
        last_name: "User",
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const user = await userModel.findOne(mockUser.email);

      expect(user).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
    });

    it("should throw an exception if the user is not found", async () => {
      const email = "nonexistent@test.com";
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(userModel.findOne(email)).rejects.toThrow(
        `User with email ${email} not found`
      );
    });

    it("should throw an exception if fetching the user fails", async () => {
      const email = "user@test.com";
      const error = new Error("Database error");
      prisma.user.findUnique.mockRejectedValue(error);

      await expect(userModel.findOne(email)).rejects.toThrow(
        `Error fetching user with email ${email}: ${error.message}`
      );
    });
  });

  describe("addUser", () => {
    it("should add a new user to the database", async () => {
      const mockUser = {
        email: "newuser@test.com",
        first_name: "New",
        last_name: "User",
        saml_role: "student",
        app_roles: ["role1"],
        department: "Test Department",
        is_active: true,
      };
      prisma.user.upsert.mockResolvedValue(mockUser);

      const user = await userModel.addUser(
        mockUser.email,
        mockUser.first_name,
        mockUser.last_name,
        mockUser.saml_role,
        mockUser.app_roles,
        mockUser.department,
        mockUser.is_active
      );

      expect(user).toEqual(mockUser);
      expect(prisma.user.upsert).toHaveBeenCalledWith({
        where: { email: mockUser.email },
        update: {
          first_name: mockUser.first_name,
          last_name: mockUser.last_name,
          saml_role: mockUser.saml_role,
          app_roles: mockUser.app_roles,
          department: mockUser.department,
          is_active: mockUser.is_active,
        },
        create: {
          email: mockUser.email,
          first_name: mockUser.first_name,
          last_name: mockUser.last_name,
          saml_role: mockUser.saml_role,
          app_roles: mockUser.app_roles,
          department: mockUser.department,
          is_active: mockUser.is_active,
        },
      });
    });

    it("should throw an exception if adding a user fails", async () => {
      const mockUser = {
        email: "newuser@test.com",
        first_name: "New",
        last_name: "User",
        saml_role: "student",
        app_roles: ["role1"],
        department: "Test Department",
        is_active: true,
      };
      const error = new Error("Database error");
      prisma.user.upsert.mockRejectedValue(error);

      await expect(
        userModel.addUser(
          mockUser.email,
          mockUser.first_name,
          mockUser.last_name,
          mockUser.saml_role,
          mockUser.app_roles,
          mockUser.department,
          mockUser.is_active
        )
      ).rejects.toThrow(
        `Error adding user ${mockUser.email}: ${error.message}`
      );
    });
  });

  describe("updateUserRole", () => {
    it("should update a user's role", async () => {
      const mockUser = { email: "user@test.com", role: "student" };
      const updatedUser = { ...mockUser, role: "admin" };
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(updatedUser);

      const user = await userModel.updateUserRole(mockUser.email, "admin");

      expect(user).toEqual(updatedUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: mockUser.email },
        data: { role: "admin" },
      });
    });

    it("should throw an error if the user is not found", async () => {
      const email = "doesnotexist@test.com";
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(userModel.updateUserRole(email, "admin")).rejects.toThrow(
        `User with email ${email} not found`
      );
    });

    it("should throw an error if the user already has the new role", async () => {
      const mockUser = { email: "user@test.com", role: "admin" };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        userModel.updateUserRole(mockUser.email, "admin")
      ).rejects.toThrow(`User ${mockUser.email} already has the role of admin`);
    });

    it("should throw an exception if updating the user's role fails", async () => {
      const mockUser = { email: "user@test.com", role: "student" };
      const error = new Error("Database error");
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockRejectedValue(error);

      await expect(
        userModel.updateUserRole(mockUser.email, "admin")
      ).rejects.toThrow(
        `Error updating user's role for ${mockUser.email}: ${error.message}`
      );
    });
  });
});
