const request = require("supertest");
const app = require("../../app");
const utilities = require("./utilities");
const { token } = utilities;

describe("GET all events by day", () => {
  const endpoint = "/api/events/day";
  
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

describe("GET all events by month", () => {
  const endpoint = "/api/events/month";

  it("should return events from the same month as the given date", async () => {
    const testData = [
      {
        event_id: 1,
        start_time: "2024-01-02T16:30:00.000Z",
        end_time: "2024-01-02T22:30:00.000Z",
        summary: "Event 1",
        description: "Event 1 Description",
        created: null,
        last_modified: "2024-02-08T09:04:08.000Z",
        status: "TENTATIVE"
      },
      {
        event_id: 2,
        start_time: "2024-01-03T08:00:00.000Z",
        end_time: "2024-01-03T22:30:00.000Z",
        summary: "Event 2",
        description: "Event 2 Description",
        created: null,
        last_modified: "2024-02-08T09:04:08.000Z",
        status: "CANCELLED"
      }
    ];

    const res = await request(app)
      .get(endpoint)
      .query({ date: "2024-01-17" })
      .set({
        Authorization: token,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].event_id).toBe(1);
    expect(res.body[1].event_id).toBe(2);
  });

  it("should return events from 15 days before to 15 days after the given date", async () => {
    const testData = [
      {
        event_id: 6,
        start_time: "2024-03-01T08:00:00.000Z",
        end_time: "2024-03-01T22:30:00.000Z",
        summary: "Event 6",
        description: "Event 6 Description",
        created: null,
        last_modified: "2024-02-08T09:04:09.000Z",
        status: "TENTATIVE"
      },
      {
        event_id: 8,
        start_time: "2024-03-31T00:00:00.000Z",
        end_time: "2024-03-31T00:00:00.000Z",
        summary: "Event 8",
        description: "Event 8 Description",
        created: null,
        last_modified: "2024-02-08T09:04:09.000Z",
        status: "CONFIRMED"
      }
    ];

    const res = await request(app)
      .get(endpoint)
      .query({ date: "2024-03-16" })
      .set({
        Authorization: token,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].event_id).toBe(6);
    expect(res.body[1].event_id).toBe(8);
  });

  it("should return empty array if events aren't found", async () => {
    const res = await request(app)
      .get(endpoint)
      .query({ date: "2022-12-16" })
      .set({
        Authorization: token,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
    expect(res.body).toStrictEqual([]);
  });

  it("should return error 400 if token is missing", async () => {
    const res = await request(app)
      .get(endpoint)
      .query({ date: "2022-12-16" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Token missing from Authorization header");
  });

  it("should return error 400 if token is invalid", async () => {
    const res = await request(app)
      .get(endpoint)
      .query({ date: "2022-12-16" })
      .set({
        Authorization: "invalidtoken",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Token invalid");
  });
});