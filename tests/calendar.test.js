const request = require("supertest");
const app = require("../app");
const utilities = require("./utilities");
const { localAdmin, student, admin } = utilities;
const endpoint = "/api/calendar";

describe("create a new openlab schedule", () => {
    test("create a new openlab schedule in db", async () => {
        const test1 = {
            id: 1,
            date: new Date(Date.now())
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            start_time: "12:00",
            end_time: "14:00",
            facilitator: "Sam Bae",
            room: "SW1-2515",
            stat: "0",
        };

        // w/o token
        const res1 = await request(app).put(endpoint).send(test1);
        expect(res1.statusCode).toBe(403);

        // with token
        const res2 = await request(app)
            .put(endpoint)
            .set({
                Authorization: localAdmin,
            })
            .send(test1);
        expect(res2.statusCode).toBe(200);
    });
});

describe("GET all dates", () => {
    test("should return all dates", async () => {
        // w/o token
        const res1 = await request(app).get(endpoint);
        expect(res1.statusCode).toBe(403);

        // with token
        const res2 = await request(app).get(endpoint).set({
            Authorization: localAdmin,
        });
        expect(res2.statusCode).toBe(200);
    });
});

describe("modify openlab", () => {
    test("modify the existing openlab from db", async () => {
        const test1 = {
            id: 1,
            date: new Date(Date.now())
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            start_time: "14:00",
            end_time: "17:00",
            facilitator: "Gangmin Bae",
            room: "SW1-2513",
            stat: "1",
        };

        // w/o token
        const res1 = await request(app).put(endpoint).send(test1);
        expect(res1.statusCode).toBe(403);

        // with token
        const res2 = await request(app)
            .put(endpoint)
            .set({
                Authorization: localAdmin,
            })
            .send(test1);
        expect(res2.statusCode).toBe(200);
    });
});
