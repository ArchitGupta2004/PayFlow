
const request = require("supertest");
const app = require("../app");
const Customer = require("../models/customer");

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

describe("Customer API Tests", () => {

    beforeEach(async () => {
        await Customer.deleteMany({});
    });

    // POST: Create Customer

    test("POST /api/customers should create a new customer", async () => {
        const customerData = {
            name: "Rahul Gupta",
            email: "rahul@example.com",
            phone: "9876543210"
        };

        const response = await request(app)
            .post("/api/customers")
            .send(customerData);

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Customer created successfully");
        expect(response.body.data.name).toBe("Rahul Gupta");
        expect(response.body.data.email).toBe("rahul@example.com");
        expect(response.body.data.phone).toBe("9876543210");
        expect(response.body.data._id).toBeDefined();
    });

    // POST: Reject Missing Required Fields

    test("POST /api/customers should reject missing required fields", async () => {
        const response = await request(app)
            .post("/api/customers")
            .send({
                phone: "9876543210"
            });

        expect(response.statusCode).toBe(400);
    });

    // POST: Reject Duplicate Email

    test("POST /api/customers should reject duplicate email", async () => {
        const customerData = {
            name: "Rahul Gupta",
            email: "rahul@example.com",
            phone: "9876543210"
        };

        await request(app)
            .post("/api/customers")
            .send(customerData);

        const response = await request(app)
            .post("/api/customers")
            .send({
                name: "Amit Gupta",
                email: "rahul@example.com",
                phone: "9999999999"
            });

        expect(response.statusCode).toBe(409);
    });

    // GET: Fetch All Customers

    test("GET /api/customers should return all customers", async () => {
        await Customer.create([
            {
                name: "Rahul Gupta",
                email: "rahul@example.com",
                phone: "9876543210"
            },
            {
                name: "Amit Gupta",
                email: "amit@example.com",
                phone: "9999999999"
            }
        ]);

        const response = await request(app)
            .get("/api/customers");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
    });

    // GET: Fetch Customer By ID

    test("GET /api/customers/:id should return a specific customer", async () => {
        const customer = await Customer.create({
            name: "Rahul Gupta",
            email: "rahul@example.com",
            phone: "9876543210"
        });

        const response = await request(app)
            .get(`/api/customers/${customer._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe("Rahul Gupta");
        expect(response.body.data.email).toBe("rahul@example.com");
    });

});
