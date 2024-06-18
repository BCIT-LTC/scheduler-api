const request = require("supertest");
const app = require("../../app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const utilities = require("./utilities");
const { admin } = utilities;

const SUPERUSER = process.env.SUPERUSER ?? "admin@bcit.ca";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    announcement: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
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

describe("Announcements API", () => {
  const endpoint = "/api/announcements";
  const authHeader = { Authorization: admin };

  describe("GET /announcements", () => {
    it("should return all announcements", async () => {
      const announcements = [
        {
          announcement_id: 1,
          title: "Test Announcement",
          description: "Test Description",
          created_by: SUPERUSER,
        },
      ];
      prisma.announcement.findMany.mockResolvedValue(announcements);
      const res = await request(app).get(endpoint).set(authHeader);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return a 403 status code if no authorization is provided", async () => {
      const res = await request(app).get(endpoint);
      expect(res.statusCode).toBe(403);
    });
  });

  describe("POST /announcements", () => {
    it("should add an announcement", async () => {
      const newAnnouncement = {
        title: "New Announcement",
        description: "This is a new announcement",
        created_by: SUPERUSER,
      };
      prisma.announcement.create.mockResolvedValue(newAnnouncement);
      const res = await request(app)
        .post(endpoint)
        .send(newAnnouncement)
        .set(authHeader);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("title", newAnnouncement.title);
      expect(res.body).toHaveProperty(
        "description",
        newAnnouncement.description
      );
    });

    it("should return 400 if required fields are missing", async () => {
      const newAnnouncement = {
        description: "This is a new announcement without title",
        created_by: SUPERUSER,
      };
      const res = await request(app)
        .post(endpoint)
        .send(newAnnouncement)
        .set(authHeader);
      expect(res.statusCode).toBe(400);
    });

    it("should return a 403 status code if no authorization is provided", async () => {
      const newAnnouncement = {
        title: "New Announcement",
        description: "This is a new announcement",
        created_by: SUPERUSER,
      };
      const res = await request(app).post(endpoint).send(newAnnouncement);
      expect(res.statusCode).toBe(403);
    });

    it("should return a 400 status code if a foreign key constraint fails", async () => {
      const newAnnouncement = {
        title: "New Announcement",
        description: "This is a new announcement",
        created_by: "nonexistent@example.com",
      };
      const mockError = new Error(
        "Foreign key constraint failed on the field: `created_by`"
      );
      prisma.announcement.create.mockRejectedValue(mockError);
      const res = await request(app)
        .post(endpoint)
        .send(newAnnouncement)
        .set(authHeader);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Foreign key constraint failed on the field: `created_by`"
      );
    });
  });

  describe("DELETE /announcements/:id", () => {
    it("should delete an announcement", async () => {
      const announcement = {
        announcement_id: 1,
        title: "Test Announcement",
        description: "Test Description",
      };
      prisma.announcement.delete.mockResolvedValue(announcement);
      prisma.announcement.findUnique.mockResolvedValue(announcement); // Ensure the record exists before deletion
      const res = await request(app)
        .delete(`${endpoint}/${announcement.announcement_id}`)
        .set(authHeader);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Success");
    });

    it("should return 400 if ID is not provided", async () => {
      const res = await request(app).delete(`${endpoint}/`).set(authHeader);
      expect(res.statusCode).toBe(400);
    });

    it("should return a 403 status code if no authorization is provided", async () => {
      const announcement = {
        announcement_id: 1,
        title: "Test Announcement",
        description: "Test Description",
      };
      const res = await request(app).delete(
        `${endpoint}/${announcement.announcement_id}`
      );
      expect(res.statusCode).toBe(403);
    });

    it("should return 404 if the record to delete does not exist", async () => {
      const mockError = new Error("Record to delete does not exist.");
      prisma.announcement.findUnique.mockResolvedValue(null); // Ensure the record does not exist
      const res = await request(app).delete(`${endpoint}/9999`).set(authHeader);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty(
        "error",
        "Record to delete does not exist."
      );
    });
  });

  describe("PUT /announcements/:id", () => {
    it("should edit an announcement", async () => {
      const announcement = {
        announcement_id: 1,
        title: "Test Announcement",
        description: "Test Description",
        created_by: SUPERUSER,
      };
      const updatedAnnouncement = {
        title: "Updated Announcement",
        description: "Updated Description",
        created_by: SUPERUSER,
        modified_by: SUPERUSER,
      };
      prisma.announcement.update.mockResolvedValue({
        ...announcement,
        ...updatedAnnouncement,
      });
      prisma.announcement.findUnique.mockResolvedValue(announcement); // Ensure the record exists before update
      const res = await request(app)
        .put(`${endpoint}/${announcement.announcement_id}`)
        .send(updatedAnnouncement)
        .set(authHeader);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("title", updatedAnnouncement.title);
      expect(res.body).toHaveProperty(
        "description",
        updatedAnnouncement.description
      );
    });

    it("should return 400 if required fields are missing", async () => {
      const announcement = {
        announcement_id: 1,
        title: "Test Announcement",
        description: "Test Description",
      };
      const updatedAnnouncement = {
        description: "This is an updated announcement without title",
      };
      const res = await request(app)
        .put(`${endpoint}/${announcement.announcement_id}`)
        .send(updatedAnnouncement)
        .set(authHeader);
      expect(res.statusCode).toBe(400);
    });

    it("should return a 403 status code if no authorization is provided", async () => {
      const announcement = {
        announcement_id: 1,
        title: "Test Announcement",
        description: "Test Description",
        created_by: SUPERUSER,
      };
      const updatedAnnouncement = {
        title: "Updated Announcement",
        description: "Updated Description",
        created_by: SUPERUSER,
        modified_by: SUPERUSER,
      };
      const res = await request(app)
        .put(`${endpoint}/${announcement.announcement_id}`)
        .send(updatedAnnouncement);
      expect(res.statusCode).toBe(403);
    });

    it("should return 404 if the record to update does not exist", async () => {
      const updatedAnnouncement = {
        title: "Updated Announcement",
        description: "Updated Description",
        created_by: SUPERUSER,
        modified_by: SUPERUSER,
      };
      const mockError = new Error("Record to update does not exist.");
      prisma.announcement.update.mockRejectedValue(mockError);
      prisma.announcement.findUnique.mockResolvedValue(null); // Ensure the record does not exist
      const res = await request(app)
        .put(`${endpoint}/9999`)
        .send(updatedAnnouncement)
        .set(authHeader);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty(
        "error",
        "Record to update does not exist."
      );
    });
  });
});
