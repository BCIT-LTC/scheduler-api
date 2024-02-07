const request = require("supertest");
const app = require("../app");
const utilities = require("./utilities");
const { localAdmin, student, admin } = utilities;
const endpoint = "/api/events/day";

describe("GET all events", () => {
  it("should return all events on the day with optional date parameter", async () => {
    const testData = [
      {
        event_id: 1,
        start_time: new Date("2024-01-02T08:30:00"),
        end_time: new Date("2024-01-02T14:30:00"),
        summary: "Event 1",
        description: "Event 1 Description",
      },
    ];
    const res = await request(app)
      .get(endpoint)
      .query({ date: "2024-01-02" })
      .set({
        Authorization: localAdmin,
      });
    expect(res.statusCode).toBe(200);
    console.log(res.body);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body).toEqual(testData);
  });
});
