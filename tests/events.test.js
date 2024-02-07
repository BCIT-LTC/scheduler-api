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

describe("GET all events by month", () => {
  const endpoint = "/api/events/month";

  test("should return events for a given month", async () => {
    let date = new Date("2024-02-20");

    const res = await request(app)
      .get(endpoint)
      .query({ date });

    expect(res.statusCode).toBe(200);
    // expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.length).toBe(4);
  });
});