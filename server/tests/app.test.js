const request = require("supertest");
const app = require("../app");
describe("PayFlow API Tests", () => {
    test("GET / should return welcome message", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Welcome to PayFlow API"
        );
    });
    test("GET /api/health should return healthy status", async () => {
        const response = await request(app).get("/api/health");
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

});