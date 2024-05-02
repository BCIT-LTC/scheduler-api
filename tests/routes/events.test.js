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
        created_at: null,
        last_modified: "2024-02-08T09:04:08.000Z",
        status: "TENTATIVE"
      },
      {
        event_id: 2,
        start_time: "2024-01-03T08:00:00.000Z",
        end_time: "2024-01-03T22:30:00.000Z",
        summary: "Event 2",
        description: "Event 2 Description",
        created_at: null,
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
        created_at: null,
        last_modified: "2024-02-08T09:04:09.000Z",
        status: "TENTATIVE"
      },
      {
        event_id: 8,
        start_time: "2024-03-31T00:00:00.000Z",
        end_time: "2024-03-31T00:00:00.000Z",
        summary: "Event 8",
        description: "Event 8 Description",
        created_at: null,
        last_modified: "2024-02-08T09:04:09.000Z",
        status: "CONFIRMED"
      },
      {
        event_id: 10,
        start_time: "2024-03-01T13:00:00",
        end_time: "2024-03-01T14:30:00",
        summary: "Event 10",
        description: "Event 10 Description",
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
    expect(res.body.length).toBe(3);
    expect(res.body[0].event_id).toBe(6);
    expect(res.body[1].event_id).toBe(8);
    expect(res.body[2].event_id).toBe(10);
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

describe("GET all events by week", () => {
  const endpoint = "/api/events/week";
  it("should return all events on the week +/-4 days withing the optional date parameter", async () => {
    const res = await request(app)
      .get(endpoint)
      .query({ date: "2024-01-02" })
      .set({
        Authorization: token,
      });
    expect(res.statusCode).toBe(200);
    console.log(res.body);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return all events on the current day if no date parameter is provided", async () => {
    const res = await request(app).get(endpoint).set({
      Authorization: token,
    });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
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

describe("GET all events by range", () => {
  const endpoint = "/api/events";
  const testData = [
    {
      event_id: 3,
      location_id: 1,
      start_time: "2024-02-19T16:30:00.000Z",
      end_time: "2024-02-19T22:30:00.000Z",
      summary: "Event 3",
      description: "Event 3 Description",
      created_at: "2024-03-21T06:17:28.000Z",
      last_modified: "2024-03-21T06:17:28.000Z",
      status: "CONFIRMED"
  },
  {
      event_id: 4,
      location_id: 1,
      start_time: "2024-02-20T16:30:00.000Z",
      end_time: "2024-02-20T22:30:00.000Z",
      summary: "Event 4",
      description: "Event 4 Description",
      created_at: "2024-03-21T06:17:28.000Z",
      last_modified: "2024-03-21T06:17:28.000Z",
      status: "CONFIRMED"
  },
  {
      event_id: 5,
      location_id: 1,
      start_time: "2024-02-26T08:00:00.000Z",
      end_time: "2024-02-26T22:30:00.000Z",
      summary: "Event 5",
      description: "Event 5 Description",
      created_at: "2024-03-21T06:17:28.000Z",
      last_modified: "2024-03-21T06:17:28.000Z",
      status: "CONFIRMED"
  }
  ];

  it("should return all events within the given range", async () => {
    const res = await request(app)
      .get(endpoint)
      .query({ start: "2024-02-01", end: "2024-02-29" })
      .set({
        Authorization: token,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0].event_id).toBe(3);
    expect(res.body[1].event_id).toBe(4);
    expect(res.body[2].event_id).toBe(5);
  });

  it("should return all events within the given range with timestamp", async () => {
    const res = await request(app)
      .get(endpoint)
      .query({ start: "2024-02-01T08:30:00", end: "2024-02-27T17:00:00" })
      .set({
        Authorization: token,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0].event_id).toBe(3);
    expect(res.body[1].event_id).toBe(4);
    expect(res.body[2].event_id).toBe(5);
  });

  it("should return all events within the given range", async () => {
    const startDate = new Date("2024-02-01");
    const endDate = new Date("2024-02-29");
    const res = await request(app)
      .get(endpoint)
      .query({ start: startDate, end: endDate })
      .set({
        Authorization: token,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0].event_id).toBe(3);
    expect(res.body[1].event_id).toBe(4);
    expect(res.body[2].event_id).toBe(5);
  });

  it ("should return empty array if no events are found", async () => {
    const res = await request(app)
      .get(endpoint)
      .query({ start: "2024-07-01", end: "2024-07-30" })
      .set({
        Authorization: token,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
    expect(res.body).toStrictEqual([]);
  });

  it ("should return error 500 if date is not parsable", async () => {
    const res = await request(app)
      .get(endpoint)
      .query({ start: "nota date", end: "notadate" })
      .set({
        Authorization: token,
      });
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Invalid date format");
  });

  it ("should return error 500 if query parameters are missing", async () => {
    const res = await request(app)
      .get(endpoint)
      .set({
        Authorization: token,
      });
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Invalid date format");
  });

  it("should return error 400 if token is missing", async () => {
    const res = await request(app)
      .get(endpoint)
      .query({ start: "2024-01-01", end: "2024-01-03" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Token missing from Authorization header");
  });

  it("should return error 400 if token is invalid", async () => {
    const res = await request(app)
      .get(endpoint)
      .query({ start: "2024-01-01", end: "2024-01-03" })
      .set({
        Authorization: "invalidtoken",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Token invalid");
  });
});

describe("POST create event", () => {
  const endpoint = "/api/events";
  it("should return a 201 status code if the event is created successfully", async () => {
    const res = await request(app)
      .post(endpoint)
      .send({
        location_id: 1,
        start_time: "2024-03-01T08:00:00.000Z",
        end_time: "2024-03-01T22:30:00.000Z",
        summary: "Event 11",
        description: "Event 11 Description",
      })
      .set({
        Authorization: token,
      });
    expect(res.statusCode).toBe(201);

    //Clean up
    await request(app)
      .delete(`/api/events/${res.body.event_id}`)
      .set({
        Authorization: token,
      });``
  });

  it("should return a 400 status code if the location_id is missing", async () => {
    const res = await request(app)
    .post(endpoint)
    .send({
      start_time: "2023-08-01T08:00:00.000Z",
      end_time: "2023-08-01T15:00:00.000Z",
      event_name: 'Test Event',
      description: 'Test Description'
    })
    .set({
      Authorization: token,
    });
    expect(res.statusCode).toBe(400);
  });
  
  it("should return a 400 status code if the start_time is missing", async () => {
    const res = await request(app)
    .post(endpoint)
    .send({
      location_id: 1,
      end_time: "2023-08-01T15:00:00.000Z",
      event_name: 'Test Event',
      description: 'Test Description'
    })
    .set({
      Authorization: token,
    });
    expect(res.statusCode).toBe(400);
  });

  it("should return a 400 status code if the end_time is missing", async () => {
    const res = await request(app)
    .post(endpoint)
    .send({
      location_id: 1,
      start_time: "2023-08-01T08:00:00.000Z",
      event_name: 'Test Event',
      description: 'Test Description',
    })
    .set({
      Authorization: token,
    });
    expect(res.statusCode).toBe(400);
  });

  it("should return a 400 status code if token is invalid", async () => {
    const res = await request(app)
    .post(endpoint)
    .send({
      location_id: 1,
      start_time: "2024-03-01T08:00:00.000Z",
      end_time: "2024-03-01T22:30:00.000Z",
      summary: "Event 10",
      description: "Event 10 Description",
    })
    .set({
      Authorization: "invalid",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Token invalid");
  });

  it("should return a 400 status code if no token is provided", async () => {
    const res = await request(app).post("/api/events");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Token missing from Authorization header");
  });
});
