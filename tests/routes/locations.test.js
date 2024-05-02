const request = require("supertest");
const app = require("../../app");
const utilities = require("./utilities");
const { token } = utilities;

describe("GET /locations", () => {
    const endpoint = "/api/locations";

    // If your endpoint behaves differently with a token, you could add a test like this:
    it("should return all locations if a valid token is provided", async () => {
        const res = await request(app).get(endpoint).set({
        Authorization: token,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("location_id");
        expect(res.body[0]).toHaveProperty("room_location");
        expect(res.body[0].room_location).toBe("NW4-3086");
        expect(res.body[1].room_location).toBe("NW4-3087");
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