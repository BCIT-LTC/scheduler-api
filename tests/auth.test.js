const request = require('supertest');
const app = require('../app');
const utilities = require('./utilities')
const {
  localAdmin,
  admin,
  student
} = utilities;

describe("login", () => {
  test("If the user has issued a jwt", async () => {
    // with jwt
    const endpoint = '/api/login';
    const res1 = await request(app).get(endpoint).set({
      'Authorization':localAdmin
    });
    console.log(res1)
    expect(res1.statusCode).toBe(200);

    // w/o jwt
    const res2 = await request(app).get(endpoint);
    console.log(res2)
    expect(res2.statusCode).toBe(403);
    
    // for normal user
  });
});

describe("logout", () => {
  test("If the user has issued a jwt", async () => {
    // with jwt
    const endpoint = '/api/logouttime';
    const res1 = await request(app).get(endpoint).set({
      'Authorization':localAdmin
    });
    console.log(res1)
    expect(res1.statusCode).toBe(200);

    // w/o jwt
    const res2 = await request(app).get(endpoint);
    console.log(res2)
    expect(res2.statusCode).toBe(403);
    
    // for normal user
  });
});
