const request = require('supertest');
const app = require('../app');
const utilities = require('./utilities')
const {
  localAdmin,
  admin,
  student
} = utilities;
const endpoint1 = "/api/announcement";

describe("GET all announcements", () => {
  test("should return all announcements", async () => {
    // w/o token
    const res1 = await request(app).get(endpoint1);
    expect(res1.statusCode).toBe(403);

    // with token
    const res2 = await request(app).get(endpoint1).set({
      'Authorization': localAdmin
    });
    expect(res2.statusCode).toBe(200);
    expect(res2.body.length).toBeGreaterThan(0);

  });
});

describe("create a new announcement", () => {
  test("create a new announcement in db under appropriate conditions", async () => {
    const body1 = {
      id: 2,
      title: "create announcement test",
      description: "create announcement test",
      date: new Date(Date.now()).toISOString().slice(0,19).replace("T"," ")
    };
    const body2 = {
      id: 3,
      title: "create announcement test",
      description: "create announcement test",
      date: new Date(Date.now()).toISOString().slice(0, 19).replace("T", " ")
    };
    const body3 = {
      id: 4,
      title: "create announcement test",
      description: "create announcement test",
      date: new Date(Date.now()).toISOString().slice(0, 19).replace("T", " ")
    };
    // w/o token
    const res1 = await request(app).post(endpoint1).send(body1);
    expect(res1.statusCode).toBe(403);

    // with token and
    const res2 = await request(app)
      .post(endpoint1)
      .set({
        'Authorization': localAdmin
      }).send(body1);
    expect(res2.statusCode).toBe(200);

    // seed db with test data for later test cases
    await request(app)
      .post(endpoint1)
      .set({
        'Authorization': localAdmin
      }).send(body2);

    await request(app)
      .post(endpoint1)
      .set({
        'Authorization': localAdmin
      }).send(body3);

    // with admin token and existing ID
    // const res3 = await request(app)
    //   .post(endpoint1)
    //   .set({
    //     'Authorization': localAdmin
    //   }).send(body1);
    // expect(res3.statusCode).toBe(500);

    // student token
    const res4 = await request(app)
      .post(endpoint1)
      .set({
        'Authorization': student
      }).send(body1);
    expect(res4.statusCode).toBe(403);

  });
});

describe("delete announcement", () => {
  test("delete the existing announcement from db", async () => {
    // w/o token
    const res1 = await request(app)
      .delete(endpoint1)
      .send({
      id: 2
    });
    expect(res1.statusCode).toBe(403);

    // with token and
    const res2 = await request(app)
      .delete(endpoint1)
      .set({
      'Authorization': localAdmin
    }).send({ id:2 });
    expect(res2.statusCode).toBe(200);

    // delete announcement that does not exist
    // const res3 = await request(app)
    //   .delete(endpoint1)
    //   .set({
    //     'Authorization': localAdmin
    //   }).send({
    //     id: 1000
    //   });
    // expect(res3.statusCode).toBe(500);

  });
});

describe("modify announcement", () => {
  test("modify the existing announcement from db", async () => {
    const body = {
      id: 3,
      title: "modify announcement test",
      description: "modify announcement test",
    };
    // w/o token
    const res1 = await request(app).put(endpoint1).send(body);
    expect(res1.statusCode).toBe(200);

    // with token and
    const res2 = await request(app)
      .put(endpoint1)
      .set({
      'Authorization': localAdmin
    }).send(body);
    expect(res2.statusCode).toBe(200);

    // announcemnt does not exist
    // const res3 = await request(app)
    //   .put(endpoint1)
    //   .set({
    //     'Authorization': localAdmin
    //   }).send({
    //     id: 1000,
    //     title: "no exist",
    //     title: "should return 500",
    //   });
    // expect(res3.statusCode).toBe(500);

  });
});
