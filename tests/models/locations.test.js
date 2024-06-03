const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  getLocationById,
  getLocations,
  createLocation,
  deleteLocation,
  updateLocation,
} = require("../../models/locations");

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    location: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Location Model", () => {
  describe("getLocationById", () => {
    it("should retrieve a location by its ID", async () => {
      const location = {
        location_id: 1,
        room_location: "Test Location",
      };

      prisma.location.findUnique.mockResolvedValue(location);
      const result = await getLocationById(1);
      expect(result).toEqual(location);
    });

    it("should log an error and throw an exception if retrieving a location by ID fails", async () => {
      const mockError = new Error("Error while fetching a location by id");
      prisma.location.findUnique.mockRejectedValue(mockError);
      await expect(getLocationById(1)).rejects.toThrow(
        "Error fetching location"
      );

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching location:",
        mockError.stack
      );
    });
  });

  describe("getLocations", () => {
    it("should retrieve all locations", async () => {
      const locations = [
        {
          location_id: 1,
          room_location: "Test Location",
        },
      ];

      prisma.location.findMany.mockResolvedValue(locations);
      const result = await getLocations();
      expect(result).toEqual(locations);
    });

    it("should log an error and throw an exception if retrieving locations fails", async () => {
      const mockError = new Error("Error while fetching locations");
      prisma.location.findMany.mockRejectedValue(mockError);

      await expect(getLocations()).rejects.toThrow("Error fetching locations");

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching locations:",
        mockError.stack
      );
    });
  });

  describe("createLocation", () => {
    it("should add a location", async () => {
      const newLocation = {
        room_location: "NW4-3241",
        created_by: "admin@bcit.ca",
      };

      prisma.location.create.mockResolvedValue(newLocation);
      const result = await createLocation(newLocation);

      expect(result).toEqual(newLocation);
    });

    it("should log an error and throw an exception if adding a location fails", async () => {
      const mockError = new Error("Error creating location");
      prisma.location.create.mockRejectedValue(mockError);

      await expect(
        createLocation({
          room_location: "NW4-3241",
          created_by: "admin@bcit.ca",
        })
      ).rejects.toThrow("Error creating location");

      expect(console.error).toHaveBeenCalledWith(
        "Error creating location:",
        mockError.stack
      );
    });
  });

  describe("deleteLocation", () => {
    it("should delete a location by its ID", async () => {
      const location = {
        location_id: 1,
        room_location: "Test Location",
      };

      prisma.location.delete.mockResolvedValue(location);
      const result = await deleteLocation(1);

      expect(result).toEqual(location);
    });

    it("should log an error and throw an exception if deleting a location fails", async () => {
      const mockError = new Error("Database error");
      prisma.location.delete.mockRejectedValue(mockError);

      await expect(deleteLocation(1)).rejects.toThrow(
        "Error deleting location"
      );

      expect(console.error).toHaveBeenCalledWith(
        "Error deleting location:",
        mockError.stack
      );
    });
  });

  describe("updateLocation", () => {
    it("should update a location by its ID", async () => {
      const updatedLocation = {
        location_id: 1,
        room_location: "Updated Location",
        modified_by: "admin@bcit.ca",
      };

      prisma.location.update.mockResolvedValue(updatedLocation);
      const result = await updateLocation(updatedLocation);

      expect(result).toEqual(updatedLocation);
    });

    it("should log an error and throw an exception if updating a location fails", async () => {
      const mockError = new Error("Database error");
      prisma.location.update.mockRejectedValue(mockError);

      await expect(
        updateLocation({
          location_id: 1,
          room_location: "Updated Location",
          modified_by: "",
        })
      ).rejects.toThrow("Error updating location");

      expect(console.error).toHaveBeenCalledWith(
        "Error updating location:",
        mockError.stack
      );
    });
  });
});
