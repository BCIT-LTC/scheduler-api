const request = require("supertest");
const app = require("../../app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const utilities = require("./utilities");
const { admin } = utilities;

const SUPERUSER = process.env.SUPERUSER ?? "admin@bcit.ca";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    location: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
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

describe("Locations API", () => {
  const endpoint = "/api/locations";
  const authHeader = { Authorization: admin };

  describe("GET /locations", () => {
    it("should return all locations", async () => {
      const locations = [
        {
          location_id: 1,
          room_location: "NW4-3086",
          created_at: new Date(),
          last_modified: new Date(),
        },
      ];
      prisma.location.findMany.mockResolvedValue(locations);
      const res = await request(app).get(endpoint).set(authHeader);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return a 403 status code if no authorization is provided", async () => {
      const res = await request(app).get(endpoint);
      expect(res.statusCode).toBe(403);
    });
  });

  describe("POST /locations", () => {
    it("should add a location", async () => {
      const newLocation = {
        room_location: "NW4-3124",
        created_by: SUPERUSER,
      };
      prisma.location.create.mockResolvedValue(newLocation);
      const res = await request(app)
        .post(endpoint)
        .send(newLocation)
        .set(authHeader);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty(
        "room_location",
        newLocation.room_location
      );
      expect(res.body).toHaveProperty("created_by", newLocation.created_by);
    });

    it("should return 400 if required fields are missing", async () => {
      const newLocation = {
        room_location: "NW4-3124",
      };
      const res = await request(app)
        .post(endpoint)
        .send(newLocation)
        .set(authHeader);
      expect(res.statusCode).toBe(400);
    });

    it("should return a 403 status code if no authorization is provided", async () => {
      const newLocation = {
        room_location: "NW4-3124",
        created_by: SUPERUSER,
      };
      const res = await request(app).post(endpoint).send(newLocation);
      expect(res.statusCode).toBe(403);
    });

    it("should return a 400 status code if a foreign key constraint fails", async () => {
      const newLocation = {
        room_location: "NW4-3124",
        created_by: "nonexistent@example.com",
      };
      const mockError = new Error(
        "Foreign key constraint failed on the field: `created_by`"
      );
      prisma.location.create.mockRejectedValue(mockError);
      const res = await request(app)
        .post(endpoint)
        .send(newLocation)
        .set(authHeader);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Foreign key constraint failed on the field: `created_by`"
      );
    });
  });

  describe("DELETE /locations/:id", () => {
    it("should delete a location", async () => {
      const location = {
        location_id: 1,
        room_location: "Test Location",
      };
      prisma.location.delete.mockResolvedValue(location);
      prisma.location.findUnique.mockResolvedValue(location);
      const res = await request(app)
        .delete(`${endpoint}/${location.location_id}`)
        .set(authHeader);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Success");
    });

    it("should return 400 if ID is not provided", async () => {
      const res = await request(app).delete(`${endpoint}/`).set(authHeader);
      expect(res.statusCode).toBe(400);
    });

    it("should return a 403 status code if no authorization is provided", async () => {
      const location = {
        location_id: 1,
        room_location: "Test Location",
      };
      const res = await request(app).delete(
        `${endpoint}/${location.location_id}`
      );
      expect(res.statusCode).toBe(403);
    });

    it("should return 404 if the record to delete does not exist", async () => {
      const mockError = new Error("Record to delete does not exist.");
      prisma.location.findUnique.mockResolvedValue(null);
      const res = await request(app).delete(`${endpoint}/9999`).set(authHeader);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty(
        "error",
        "Record to delete does not exist."
      );
    });
  });

  describe("PUT /locations/:id", () => {
    it("should edit a location", async () => {
      const location = {
        location_id: 1,
        room_location: "Test Location",
        created_by: SUPERUSER,
      };
      const updatedLocation = {
        room_location: "Updated Location",
        created_by: SUPERUSER,
        modified_by: SUPERUSER,
      };
      prisma.location.update.mockResolvedValue({
        ...location,
        ...updatedLocation,
      });
      prisma.location.findUnique.mockResolvedValue(location);
      const res = await request(app)
        .put(`${endpoint}/${location.location_id}`)
        .send(updatedLocation)
        .set(authHeader);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty(
        "room_location",
        updatedLocation.room_location
      );
      expect(res.body).toHaveProperty("modified_by", updatedLocation.modified_by);
    });

    it("should return 400 if required fields are missing", async () => {
      const location = {
        location_id: 1,
        room_location: "Test Location",
      };
      const updatedLocation = {
        room_location: "Updated Location",
      };
      const res = await request(app)
        .put(`${endpoint}/${location.location_id}`)
        .send(updatedLocation)
        .set(authHeader);
      expect(res.statusCode).toBe(400);
    });

    it("should return a 403 status code if no authorization is provided", async () => {
      const location = {
        location_id: 1,
        room_location: "Test Location",
        created_by: SUPERUSER,
      };
      const updatedLocation = {
        room_location: "Updated Location",
        created_by: SUPERUSER,
        modified_by: SUPERUSER,
      };
      const res = await request(app)
        .put(`${endpoint}/${location.location_id}`)
        .send(updatedLocation);
      expect(res.statusCode).toBe(403);
    });

    it("should return 404 if the record to update does not exist", async () => {
      const updatedLocation = {
        room_location: "Updated Location",
        created_by: SUPERUSER,
        modified_by: SUPERUSER,
      };
      const mockError = new Error("Record to update does not exist.");
      prisma.location.update.mockRejectedValue(mockError);
      prisma.location.findUnique.mockResolvedValue(null);
      const res = await request(app)
        .put(`${endpoint}/9999`)
        .send(updatedLocation)
        .set(authHeader);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty(
        "error",
        "Record to update does not exist."
      );
    });
  });
});
