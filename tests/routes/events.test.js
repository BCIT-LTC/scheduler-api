const request = require("supertest");
const app = require("../../app");
const { createEvent, deleteEvent } = require("../../models/events");
const utilities = require("./utilities");
const { admin } = utilities;

const test_start_date = new Date("2023-08-01T08:00:00.000Z");
const test_end_date = new Date("2023-08-01T15:00:00.000Z");

describe(`GET /api/events/:id`, () => {
  it("should return a specific event by ID", async () => {
    const event = await createEvent({
      location_id: 1,
      start_time: test_start_date,
      end_time: test_end_date,
      summary: "Event 1",
      description: "Event 1 Description",
    });

    const res = await request(app)
      .get(`/api/events/${event.event_id}`)
      .set({
        Authorization: admin,
      })

    expect(res.statusCode).toBe(200);
    expect(res.body.event_id).toBe(event.event_id);

    await deleteEvent(event.event_id);
  });

  it("should return a 404 status code if the event does not exist", async () => {
    const res = await request(app).get(`/api/events/1000`);
    expect(res.statusCode).toBe(404);
  });
});

describe(`GET /api/events/day`, () => {
  it("should return all events for a specific day", async () => {
    const res = await request(app)
      .get(`/api/events/day`)
      .set({
        Authorization: admin,
      })
      .query({ date: "2024-01-02" });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return all events for the current day if no date parameter is provided", async () => {
    const res = await request(app)
      .get(`/api/events/day`)
      .set({
        Authorization: admin,
      })
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe(`GET /api/events/month`, () => {
  it("should return all events for a specific month", async () => {
    const res = await request(app)
      .get(`/api/events/month`)
      .set({
        Authorization: admin,
      })
      .query({ date: "2024-01-17" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return all events for the current month if no date parameter is provided", async () => {
    const res = await request(app)
      .get(`/api/events/month`)
      .set({
        Authorization: admin,
      })
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe(`GET /api/events/week`, () => {
  it("should return all events for a specific week", async () => {
    const res = await request(app)
      .get(`/api/events/week`)
      .set({
        Authorization: admin,
      })
      .query({ date: "2024-01-02" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return all events for the current week if no date parameter is provided", async () => {
    const res = await request(app)
      .get(`/api/events/week`)
      .set({
        Authorization: admin,
      })

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe(`GET /api/events`, () => {
  it("should return all events within the given range", async () => {
    const res = await request(app)
      .get(`/api/events`)
      .set({
        Authorization: admin,
      })
      .query({ start: "2024-02-01", end: "2024-02-29" });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return an empty array if no events are found", async () => {
    const res = await request(app)
      .get(`/api/events`)
      .set({
        Authorization: admin,
      })
      .query({ start: "2024-07-01", end: "2024-07-30" });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});

describe(`POST /api/events`, () => {
  it("should create a new event", async () => {
    const res = await request(app)
      .post(`/api/events`)
      .set({
        Authorization: admin,
      })
      .send({
        location_id: 1,
        start_time: test_start_date,
        end_time: test_end_date,
        summary: "Event 11",
        description: "Event 11 Description",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.event_id).toBeDefined();

    await deleteEvent(res.body.event_id); // Clean up
  });

  it("should return a 400 status code if the request body is invalid", async () => {
    const res = await request(app)
      .post(`/api/events`)
      .send({
        location_id: "invalid",
        start_time: test_start_date,
        end_time: test_end_date,
        summary: "Event 11",
        description: "Event 11 Description",
      });
    expect(res.statusCode).toBe(400);
  });
});

describe(`DELETE /api/events/:id`, () => {
  it("should delete an event by ID", async () => {
    const event = await createEvent({
      location_id: 1,
      start_time: test_start_date,
      end_time: test_end_date,
      summary: "Event 1",
      description: "Event 1 Description",
    });

    const res = await request(app)
      .delete(`/api/events/${event.event_id}`)
      .set({
        Authorization: admin,
      })

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Event deleted successfully");
  });

  it("should return a 404 status code if the event does not exist", async () => {
    const res = await request(app)
      .delete(`/api/events/1000`)
      .set({
        Authorization: admin,
      })

    expect(res.statusCode).toBe(404);
  });
});
