const request = require("supertest");
const app = require("../app");
const utilities = require("./utilities");
const endpoint1 = "localhost:8000/api/events";

describe("GET all events", () => {
  test("should return all events on the day with optional date parameter", async () => {
    const endpoint = `${endpoint1}/day?date=2024-01-02`;
    const res = await request(app).get(endpoint);
    expect(res.statusCode).toBe(200);
    console.log(res.body);
    // expect(res.body.length).toBeGreaterThan(0);
  });
});
