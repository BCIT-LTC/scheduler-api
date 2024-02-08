const request = require("supertest");
const app = require("../app");
const utilities = require("./utilities");
const endpoint1 = "/api/events";

describe("GET all events", () => {
  test("should return all events", async () => {
    const res = await request(app).get(endpoint1);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
