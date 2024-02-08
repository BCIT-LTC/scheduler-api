const request = require("supertest");
const app = require("../../app");
const utilities = require("./utilities");
const { token } = utilities;
const endpoint = "/api/events/day";

describe("GET all events by day", () => {
  it("should return a 403 status code if no token is provided with optional date parameter", async () => {
    const res = await request(app).get(endpoint).query({ date: "2024-01-02" });
    expect(res.statusCode).toBe(400);
  });

  it("should return all events on the day with optional date parameter", async () => {
    const res = await request(app)
      .get(endpoint)
      .query({ date: "2024-01-02" })
      .set({
        Authorization: token,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].event_id).toBe(1);
  });

  it("should return a 403 status code if no token is provided", async () => {
    const res = await request(app).get(endpoint);
    expect(res.statusCode).toBe(400);
  });

  it("should return all events on the current day if no date parameter is provided", async () => {
    const res = await request(app).get(endpoint).set({
      Authorization: token,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0); // we don't have any events for today in the database
  });
});
