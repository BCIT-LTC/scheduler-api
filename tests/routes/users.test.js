const request = require("supertest");
const app = require("../../app");
const utilities = require("./utilities");
const { admin, faculty, student, token } = utilities;
const endpoint = "/api/users";

/** 
 *  All user roles should have access to this endpoint
 *  to view users (e.g., students RSVPing to events)
 */
describe("GET all users", () => {
  test("should return all users with admin token", async () => {
    // with token
    const res = await request(app).get(endpoint).set({
      Authorization: admin,
    });
    // Expect 404 if no users are found
    if (res.body.length == 0) {
      expect(res.statusCode).toBe(404);
    }
    // Expect 200 if users are found
    if (res.body.length > 0) {
      expect(res.statusCode).toBe(200);
    }
  });

  test("should return all users with faculty token", async () => {
    // with token
    const res = await request(app).get(endpoint).set({
      Authorization: faculty,
    });
    // Expect 404 if no users are found
    if (res.body.length == 0) {
      expect(res.statusCode).toBe(404);
    }
    // Expect 200 if users are found
    if (res.body.length > 0) {
      expect(res.statusCode).toBe(200);
    }
  });

  test("should return all users with student token", async () => {
    // with token
    const res = await request(app).get(endpoint).set({
      Authorization: student,
    });
    // Expect 404 if no users are found
    if (res.body.length == 0) {
      expect(res.statusCode).toBe(404);
    }
    // Expect 200 if users are found
    if (res.body.length > 0) {
      expect(res.statusCode).toBe(200);
    }
  });

  test("should return all users with guest token", async () => {
    // with token
    const res = await request(app).get(endpoint).set({
      Authorization: token,
    });
    // Expect 404 if no users are found
    if (res.body.length == 0) {
      expect(res.statusCode).toBe(404);
    }
    // Expect 200 if users are found
    if (res.body.length > 0) {
      expect(res.statusCode).toBe(200);
    }
  });

  test("should return 403 with invalid token", async () => {
    // with invalid token
    const res = await request(app).get(endpoint).set({
      Authorization: "invalid token",
    });
    expect(res.statusCode).toBe(400); // 400 is bad request via auth middleware
  });
});
