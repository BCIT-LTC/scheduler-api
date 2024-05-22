const request = require("supertest");
const app = require("../../app");
const utilities = require("./utilities");
const { admin } = utilities;

describe("GET /locations", () => {
  const endpoint = "/api/locations";

  // If your endpoint behaves differently with a token, you could add a test like this:
  it("should return all locations if a valid token is provided", async () => {
    const res = await request(app).get(endpoint).set({ Authorization: admin });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0); // Ensure there are locations returned
    expect(res.body[0]).toHaveProperty("location_id");
    expect(res.body[0]).toHaveProperty("room_location");
    expect(res.body[0]).toHaveProperty("created_at");
    expect(res.body[0]).toHaveProperty("last_modified");
  });

  it("should return a 400 status code if no token is provided", async () => {
    const res = await request(app).get(endpoint);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Token missing from Authorization header");
  });

  it("should return a 400 status code if token is invalid", async () => {
    const res = await request(app).get(endpoint).set({
      Authorization: "invalid",
    });

    it("should return a 400 status code if no token is provided", async () => {
        const res = await request(app).get(endpoint);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Token missing from Authorization header");
    });

    it("should return a 400 status code if token is invalid", async () => {
        const res = await request(app).get(endpoint).set({
            Authorization: "invalid",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Token invalid");
    });
  });
});

describe("create a new location, POST /locations", () => {
    it("should post new location NW4-3124", async () => {
        const res = await request(app).post(endpoint).set({
            Authorization: token,
        }).send({
            room_location: "NW4-3124",
            modified_by: "admin@bcit.ca",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.room_location).toBe("NW4-3124");
    }); 
});