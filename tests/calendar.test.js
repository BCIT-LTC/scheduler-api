const request = require('supertest');
const app = require('../app');

describe("GET /api/announcement", () => {
  test("should return all announcements", async () => {
    const res1 = await request(app).get("/api/announcement");
    console.log(res1.status)
    expect(res1.statusCode).toBe(403);
    expect(res1.body.length).toBe(0);

    const res2 = await request(app).get("/api/announcement");
    console.log(res2.status)
    expect(res2.statusCode).toBe(200);
    expect(res2.body.length).toBeGreaterThan(0);
  });
});

// describe('Photos endpoint', () => {
//   test('should return hello world object', async () => {
//     const res = await request(app)
//       .get('/api/photos')
//     expect(res.statusCode).toEqual(200)
//     expect(res.body).toEqual({
//       message: "Hello World"
//     })
//   })
// })