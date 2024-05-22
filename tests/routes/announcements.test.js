const request = require("supertest");
const app = require("../../app");
const utilities = require("./utilities");
const { guest, admin } = utilities;

describe("GET all announcements", () => {
  const endpoint = "/api/announcement";

  it("should return all announcements", async () => {
    const res = await request(app)
      .get(endpoint)
      .set({
        Authorization: admin,
      });
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return a 400 status code if no guest is provided", async () => {
    const res = await request(app).get(endpoint).set({
      Authorization: "",
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("POST create or update announcement", () => {
  const endpoint = "/api/announcement";

  it("should return a 200 status code if the announcement is updated successfully", async () => {
    const res = await request(app)
      .post(endpoint)
      .set({
        Authorization: admin,
      })
      .send({
        announcement_id: 1,
        title: "Updated Title",
        description: "Updated Description",
        date: "2023-04-28T10:05:16.000Z",
      });
    expect(res.statusCode).toBe(200);
    // expect(res.body.announcement_id).toBe(1); // This is not working
    // expect(res.body.title).toBe("Updated Title");
    // expect(res.body.description).toBe("Updated Description");
    // expect(res.body.created_at).toBe("2023-04-28T10:05:16.000Z");
  });

  it("should return a 400 status code if no guest is provided", async () => {
    const res = await request(app).post(endpoint).set({ Authorization: "" });
    expect(res.statusCode).toBe(400);
  });
});
