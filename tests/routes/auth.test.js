const request = require("supertest");
const app = require("../../app");
const utilities = require("./utilities");
const { admin } = utilities;

describe("Test suite for the auth routes", () => {
  it("Should return 200 for a valid token", async () => {
    const response = await request(app)
      .post("/authorize")
      .set("Authorization", admin)
      .send({
        email: "test@test.com",
        first_name: "Test",
        last_name: "User",
        saml_role: "student",
        school: "Test School",
        department: "Test Program",
        is_active: true,
      });
    expect(response.statusCode).toBe(200);
  });

  it("Should return 200 for an invalid token", async () => {
    const response = await request(app)
      .post("/authorize")
      .set({Authorization: "invalid_token"})
      .send({
        email: "test1@test.com",
        first_name: "Test1",
        last_name: "User",
        saml_role: "student",
        school: "Test School",
        department: "Test Program",
        is_active: true,
      });
    expect(response.statusCode).toBe(200);
  });
});
