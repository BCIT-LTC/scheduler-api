const request = require('supertest');
const app = require('../app');

// describe('Sanity test', () => {
//   test('1 should equal 1', () => {
//     expect(1).toBe(1)
//   })
// })

// has to happen after the database is connected
describe("GET /api/announcement", () => {
  test("should return all announcements", async () => {
    const res = await request(app).get("/api/announcement");
    console.log(res.status)
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
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