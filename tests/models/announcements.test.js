const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  getAnnouncementById,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} = require("../../models/announcements");

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    announcement: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("Announcement Model", () => {
  describe("getAnnouncementById", () => {
    it("should retrieve an announcement by its ID", async () => {
      const announcement = {
        announcement_id: 1,
        title: "Test Announcement",
        description: "Test Description",
      };

      prisma.announcement.findUnique.mockResolvedValue(announcement);
      const result = await getAnnouncementById(1);
      expect(result).toEqual(announcement);
    });

    it("should log an error and throw an exception if retrieving an announcement by ID fails", async () => {
      const mockError = new Error("Error while fetching an announcement by id");
      prisma.announcement.findUnique.mockRejectedValue(mockError);
      await expect(getAnnouncementById(1)).rejects.toThrow(
        "Error while fetching an announcement by id"
      );

      expect(console.error).toHaveBeenCalledWith(
        "Error while fetching an announcement by id:",
        mockError.stack
      );
    });
  });

  describe("getAnnouncements", () => {
    it("should retrieve all announcements", async () => {
      const announcements = [
        {
          announcement_id: 1,
          title: "Test Announcement",
          description: "Test Description",
        },
      ];

      prisma.announcement.findMany.mockResolvedValue(announcements);
      const result = await getAnnouncements();
      expect(result).toEqual(announcements);
    });

    it("should log an error and throw an exception if retrieving announcements fails", async () => {
      const mockError = new Error("Error while fetching announcements");
      prisma.announcement.findMany.mockRejectedValue(mockError);

      await expect(getAnnouncements()).rejects.toThrow(
        "Error while fetching announcements"
      );

      expect(console.error).toHaveBeenCalledWith(
        "Error while fetching announcements:",
        mockError.stack
      );
    });
  });

  describe("createAnnouncement", () => {
    it("should add an announcement", async () => {
      const newAnnouncement = {
        announcement_id: 1,
        title: "New Announcement",
        description: "This is a new announcement",
        created_by: "admin@bcit.ca",
      };

      prisma.announcement.create.mockResolvedValue(newAnnouncement);
      const result = await createAnnouncement(newAnnouncement);

      expect(result).toEqual(newAnnouncement);
    });
    it("should log an error and throw an exception if adding an announcement fails", async () => {
      const mockError = new Error("Error while adding an announcement");

      prisma.announcement.create.mockRejectedValue(mockError);

      await expect(
        createAnnouncement({
          title: "New Announcement",
          description: "This is a new announcement",
          created_by: "admin@bcit.ca",
        })
      ).rejects.toThrow(mockError);

      expect(console.error).toHaveBeenCalledWith(
        "Error while adding an announcement:",
        mockError.stack
      );
    });
  });

  describe("deleteAnnouncement", () => {
    it("should delete an announcement by its ID", async () => {
      const announcement = {
        announcement_id: 1,
        title: "Test Announcement",
        description: "Test Description",
      };

      prisma.announcement.delete.mockResolvedValue(announcement);
      const result = await deleteAnnouncement(1);

      expect(result).toEqual(announcement);
    });
    it("should log an error and throw an exception if deleting an announcement fails", async () => {
      const mockError = new Error("Database error");
      prisma.announcement.delete.mockRejectedValue(mockError);

      await expect(deleteAnnouncement(1)).rejects.toThrow(
        "Error while deleting an announcement"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error while deleting an announcement:",
        mockError.stack
      );
    });
  });
  describe("updateAnnouncement", () => {
    it("should update an announcement by its ID", async () => {
      const announcement = {
        announcement_id: 1,
        title: "Updated Announcement",
        description: "Updated Description",
        modified_by: "admin@bcit.ca",
      };

      prisma.announcement.update.mockResolvedValue(announcement);
      const result = await updateAnnouncement(
        1,
        "Updated Announcement",
        "Updated Description",
        "admin@bcit.ca"
      );

      expect(result).toEqual(announcement);
    });

    it("should log an error and throw an exception if updating an announcement fails", async () => {
      const mockError = new Error("Database error");

      prisma.announcement.update.mockRejectedValue(mockError);

      await expect(
        updateAnnouncement(
          1,
          "Updated Announcement",
          "Updated Description",
          "admin@bcit.ca"
        )
      ).rejects.toThrow("Error while editing an announcement");
      expect(console.error).toHaveBeenCalledWith(
        "Error while editing an announcement:",
        mockError.stack
      );
    });
  });
});
