const request = require("supertest");
const app = require("../app");
const utilities = require("./utilities");
const { localAdmin, student, admin } = utilities;
const endpoint = "/api/calendar";

describe("create a new openlab schedule", () => {
    test("create a new openlab schedule in db", async () => {
        const test1 = {
            id: 1,
            date: new Date(Date.now()),
            start_time: "12:00",
            end_time: "14:00",
            facilitator: "Sam Bae",
            room: "SW1-2515",
            stat: "0",
        };

        const res1 = await request(app).put(endpoint).send(test1);
        expect(res1.statusCode).toBe(200);
    });
});

describe("GET calendar by month and year", () => {
    test("should return calendar for a specific month and year", async () => {
        const month = "05"; // Specify the month you want to test
        const year = "2023"; // Specify the year you want to test

        const res = await request(app)
            .get(endpoint)
            .query({ month, year })
            .set({
                Authorization: localAdmin,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.results).toBeDefined();

        console.log(res.body.results);
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

        const res1 = await request(app).put(endpoint).send(test1);
        expect(res1.statusCode).toBe(200);
    });
});
