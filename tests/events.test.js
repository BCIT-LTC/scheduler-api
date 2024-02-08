const request = require("supertest");
const app = require("../app");
const utilities = require("./utilities");
const { token } = utilities;
const endpoint = "/api/events/day";

describe("GET all events by day", () => {
  const testData = [
    // this object is the same as the one in the database
    {
      event_id: 1,
      start_time: "2024-01-02T16:30:00.000Z",
      end_time: "2024-01-02T22:30:00.000Z",
      summary: "Event 1",
      description: "Event 1 Description",
      created: null,
      last_modified: "2024-02-06T05:37:09.000Z",
      status: "TENTATIVE",
    },
  ];
  it("should return all events on the day with optional date parameter", async () => {
    const res = await request(app)
      .get(endpoint)
      .query({ date: "2024-01-02" })
      .set({
        Authorization: token,
      });
    expect(res.statusCode).toBe(200);
    console.log(res.body);
    // expect(res.body.length).toBeGreaterThan(0);
    expect(res.body).toEqual(testData);
  });

  it("should return all events on the current day if no date parameter is provided", async () => {
    const res = await request(app).get(endpoint).set({
      Authorization: token,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0); // we don't have any events for today in the database
  });
});
