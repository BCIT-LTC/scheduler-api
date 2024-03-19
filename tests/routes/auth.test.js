const request = require("supertest");
const app = require("../../app");
const utilities = require("./utilities");
const { token } = utilities;

describe("Test suite for the auth routes", () => {
  it("Should return 200 for a valid token", async () => {
    const response = await request(app)
      .post("/authorize")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "test@test.com",
        first_name: "Test",
        last_name: "User",
        saml_role: "student",
        app_role: "student",
        school: "Test School",
        program: "Test Program",
        isActive: true,
      });
    expect(response.statusCode).toBe(200);
  });
});
