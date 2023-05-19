// const request = require('supertest');
// const app = require('../app');
// const utilities = require('./utilities')
// const {
//   localAdmin,
//   admin,
//   student
// } = utilities;

// describe("login", () => {
//   test("If the user has issued a jwt", async () => {
//     // with jwt
//     const endpoint = '/api/login';
//     const res1 = await request(app).get(endpoint).set({
//       'Authorization':localAdmin
//     });
//     expect(res1.statusCode).toBe(200);

//     // w/o jwt
//     const res2 = await request(app).get(endpoint);
//     expect(res2.statusCode).toBe(403);
    
//     // for normal user
//     const res3 = await request(app).get(endpoint).set({
//       'Authorization': student
//     });
//     expect(res3.statusCode).toBe(200);
//   });
// });

// describe("logout", () => {
//   test("If the user has issued a jwt", async () => {
//     // with jwt
//     const endpoint = '/api/logouttime';
//     const res1 = await request(app).post(endpoint).set({
//       'Authorization':localAdmin
//     });
//     expect(res1.statusCode).toBe(200);

//     // w/o jwt
//     const res2 = await request(app).post(endpoint);
//     expect(res2.statusCode).toBe(403);
    
//     // for normal user
//     const res3 = await request(app).post(endpoint).set({
//       'Authorization': student
//     });
//     expect(res3.statusCode).toBe(200);
//   });
// });

// describe("logout", () => {
//   test("If the user has issued a jwt", async () => {
//     // with jwt
//     const endpoint = "/api/admin"
//     const res1 = await request(app).get(endpoint).set({
//       'Authorization':localAdmin
//     });
//     expect(res1.statusCode).toBe(200);

//     // w/o jwt
//     const res2 = await request(app).get(endpoint);
//     expect(res2.statusCode).toBe(403);
    
//     // for normal user
//   });
// });

// describe("admin post", () => {
//   test("If the user has issued a jwt", async () => {
//     // with jwt
//     const endpoint = "/api/admin"
//     const res1 = await request(app).post(endpoint).set({
//       'Authorization':localAdmin
//     });
//     expect(res1.statusCode).toBe(200);

//     // w/o jwt
//     const res2 = await request(app).post(endpoint);
//     expect(res2.statusCode).toBe(403);
    
//     // for normal user
//     const res3 = await request(app).post(endpoint).set({
//       'Authorization': student
//     });
//     expect(res3.statusCode).toBe(403);
//   });
// });
