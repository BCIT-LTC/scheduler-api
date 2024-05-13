// Mocking the Prisma Client
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    announcement: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
    prisma: mockPrisma,
  };
});

const { prisma } = require("@prisma/client");
const createLogger = require("../../logger");

// Mock the logger
jest.mock("../../logger");

const logger = {
  error: jest.fn(),
};
createLogger.mockReturnValue(logger);

// Import the functions to test
const {
  getAnnouncement,
  addAnnouncement,
  deleteAnnouncement,
  editAnnouncement,
} = require("../../models/announcement");

// Organize related tests into a test suite
describe("Announcement Model", () => {
  // Ensures data clean up after each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test sub-suite for the getAnnouncement function
  describe("getAnnouncement", () => {
    // Test case for successful retrieval of announcements
    it("should successfully return all announcements", async () => {
      const test_create_date = new Date("2024-04-27T15:14:55.000Z");
      const test_modify_date = new Date("2024-04-28T17:18:21.000Z");

      const mockAnnouncements = [
        {
          announcement_id: 1,
          title: "Announcement 1",
          description: "Description 1",
          created_at: test_create_date,
          created_by: "Admin",
          last_modified: test_modify_date,
          modified_by: "Admin",
          event_id: 1,
        },
        {
          announcement_id: 2,
          title: "Announcement 2",
          description: "Description 2",
          created_at: test_create_date,
          created_by: "Admin",
          last_modified: test_modify_date,
          modified_by: "Admin",
          event_id: 2,
        },
      ];
      // Mocks the database query
      prisma.announcement.findMany.mockResolvedValue(mockAnnouncements);

      // Retrieves the announcements
      const announcements = await getAnnouncement();

      // Validate the results and number of calls to the database
      expect(announcements).toEqual(mockAnnouncements);
      expect(prisma.announcement.findMany).toHaveBeenCalledTimes(1);
    });

    // Test case for failed retrieval of announcements
    it("should log an error and throw an exception if retrieving announcements fails", async () => {
      const mockError = new Error("Database query failed");

      // Mock the rejected value for the database query
      prisma.announcement.findMany.mockRejectedValue(mockError);

      // Validate that the error is thrown and logged
      await expect(getAnnouncement()).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith({
        message: "Error while fetching announcements",
        error: mockError.stack,
      });
    });
  });

  // Test sub-suite for the addAnnouncement function
  describe("addAnnouncement", () => {
    // Test case for successful addition of an announcement
    it("should successfully add an announcement", async () => {
      const test_date = new Date();
      const mockAnnouncement = {
        announcement_id: 1,
        title: "Announcement 1",
        description: "Description 1",
        created_at: test_date,
        created_by: null,
        last_modified: test_date,
        modified_by: null,
        event_id: null,
      };

      // Mocks the database query
      prisma.announcement.create.mockResolvedValue(mockAnnouncement);

      // Adds the announcement
      const announcement = await addAnnouncement(
        "Announcement 1",
        "Description 1",
        test_date
      );

      // Validate the results and number of calls to the database
      expect(announcement).toEqual(mockAnnouncement);
      expect(prisma.announcement.create).toHaveBeenCalledWith({
        data: {
          title: "Announcement 1",
          description: "Description 1",
          created_at: test_date,
          created_by: null,
          last_modified: test_date,
          modified_by: null,
          event_id: null,
        },
      });
      expect(prisma.announcement.create).toHaveBeenCalledTimes(1);
    });

    // Test case for failed addition of an announcement
    it("should log an error and throw an exception if adding an announcement fails", async () => {
      const test_date = new Date();
      const mockError = new Error("Database query failed");

      // Mock the rejected value for the database query
      prisma.announcement.create.mockRejectedValue(mockError);

      // Validate that the error is thrown and logged
      await expect(
        addAnnouncement("Announcement 1", "Description 1", test_date)
      ).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith({
        message: "Error while adding an announcement",
        error: mockError.stack,
      });
    });

    // Test case for null or undefined title
    it("should throw an error if title is null or undefined", async () => {
      const test_date = new Date();

      await expect(
        addAnnouncement(null, "Description 1", test_date)
      ).rejects.toThrow();
      await expect(
        addAnnouncement(undefined, "Description 1", test_date)
      ).rejects.toThrow();
    });

    // Test case for null or undefined description
    it("should throw an error if description is null or undefined", async () => {
      const test_date = new Date();

      await expect(
        addAnnouncement("Announcement 1", null, test_date)
      ).rejects.toThrow();
      await expect(
        addAnnouncement("Announcement 1", undefined, test_date)
      ).rejects.toThrow();
    });

    // Test case for null or undefined date
    it("should throw an error if date is null or undefined", async () => {
      await expect(
        addAnnouncement("Announcement 1", "Description 1", null)
      ).rejects.toThrow();
      await expect(
        addAnnouncement("Announcement 1", "Description 1", undefined)
      ).rejects.toThrow();
    });
  });

  // Test sub-suite for the deleteAnnouncement function
  describe("deleteAnnouncement", () => {
    it("should delete an announcement by its ID", async () => {
      const test_create_date = new Date("2024-05-11T15:14:55.000Z");
      const test_modify_date = new Date("2024-05-12T15:20:31.000Z");

      const mockDeletedAnnouncement = {
        announcement_id: 4,
        title: "Deleted Announcement",
        description: "Deleted Description",
        created_at: test_create_date,
        created_by: null,
        last_modified: test_modify_date,
        modified_by: null,
        event_id: null,
      };
      prisma.announcement.delete.mockResolvedValue(mockDeletedAnnouncement);

      // Delete the announcement and validate the results
      const deletedAnnouncement = await deleteAnnouncement(4);
      expect(deletedAnnouncement).toEqual(mockDeletedAnnouncement);
      expect(prisma.announcement.delete).toHaveBeenCalledWith({
        where: { announcement_id: 4 },
      });
    });

    // Test case for failed deletion of an announcement
    it("should log an error and throw an exception if deleting an announcement fails", async () => {
      const mockError = new Error("Database error");
      prisma.announcement.delete.mockRejectedValue(mockError);

      // Validate that the error is thrown and logged
      await expect(deleteAnnouncement(5)).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith({
        message: "Error while deleting an announcement",
        error: mockError.stack,
      });
    });

    // Test case for null or undefined ID
    it("should throw an error if ID is null or undefined", async () => {
      await expect(deleteAnnouncement(null)).rejects.toThrow();
      await expect(deleteAnnouncement(undefined)).rejects.toThrow();
    });
  });

  // Test sub-suite for the editAnnouncement function
  describe("editAnnouncement", () => {
    it("should update an announcement by its ID", async () => {
      const test_create_date = new Date("2024-05-01T15:14:55.000Z");
      const test_modify_date = new Date("2024-05-12T15:20:31.000Z");

      const updatedAnnouncement = {
        announcement_id: 5,
        title: "Test Announcement",
        description: "Test Description",
        created_at: test_create_date,
        created_by: null,
        last_modified: test_modify_date,
        modified_by: null,
        event_id: null,
      };
      prisma.announcement.update.mockResolvedValue(updatedAnnouncement);

      // Update the announcement and validate the results
      const editedAnnouncement = await editAnnouncement(
        5,
        "Updated Announcement",
        "Updated Description",
        test_modify_date
      );

      // Validate the results and number of calls to the database
      expect(editedAnnouncement).toEqual(updatedAnnouncement);
      expect(prisma.announcement.update).toHaveBeenCalledWith({
        where: { announcement_id: 5 },
        data: {
          title: "Updated Announcement",
          description: "Updated Description",
          last_modified: test_modify_date,
        },
      });
      expect(prisma.announcement.update).toHaveBeenCalledTimes(1);
    });

    // Test case for failed update of an announcement
    it("should log an error and throw an exception if updating an announcement fails", async () => {
      const mockError = new Error("Database error");
      prisma.announcement.update.mockRejectedValue(mockError);

      await expect(
        editAnnouncement(6, "Title", "Description", new Date())
      ).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith({
        message: "Error while editing an announcement",
        error: mockError.stack,
      });
    });

    // Test case for null or undefined ID
    it("should throw an error if ID is null or undefined", async () => {
      await expect(
        editAnnouncement(null, "Title", "Description", new Date())
      ).rejects.toThrow();
      await expect(
        editAnnouncement(undefined, "Title", "Description", new Date())
      ).rejects.toThrow();
    });

    // Test case for null or undefined title
    it("should throw an error if title is null or undefined", async () => {
      await expect(
        editAnnouncement(5, null, "Description", new Date())
      ).rejects.toThrow();
      await expect(
        editAnnouncement(5, undefined, "Description", new Date())
      ).rejects.toThrow();
    });

    // Test case for null or undefined description
    it("should throw an error if description is null or undefined", async () => {
      await expect(
        editAnnouncement(5, "Title", null, new Date())
      ).rejects.toThrow();
      await expect(
        editAnnouncement(5, "Title", undefined, new Date())
      ).rejects.toThrow();
    });

    // Test case for null or undefined date
    it("should throw an error if date is null or undefined", async () => {
      await expect(
        editAnnouncement(5, "Title", "Description", null)
      ).rejects.toThrow();
      await expect(
        editAnnouncement(5, "Title", "Description", undefined)
      ).rejects.toThrow();
    });
  });
});
