const request = require("supertest");
const app = require("../app");
const Customer = require("../models/customer");
// Basic API Tests
describe("PayFlow API Tests", () => {
    test("GET / should return welcome message", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Welcome to PayFlow API");
    });
    test("GET /api/health should return healthy status", async () => {
        const response = await request(app).get("/api/health");
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });
    // Error Middleware Test
    test("Error middleware should return 404 for unknown routes", async () => {
        const response = await request(app)
            .get("/api/unknown-route");
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Route not found");
    });
});

// Customer API Tests

describe("Customer API Tests", () => {
    beforeEach(async () => {
        await Customer.deleteMany({});
    });

    // POST: Create Customer

    test("POST /api/customers should create a new customer", async () => {
        const response = await request(app)
            .post("/api/customers")
            .send({
                name: "Rahul Gupta",
                email: "rahul@example.com",
                phone: "9876543210"
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe("Rahul Gupta");
        expect(response.body.data.email).toBe("rahul@example.com");
    });

    // POST: Missing Required Fields
    test("POST /api/customers should reject missing required fields", async () => {
        const response = await request(app)
            .post("/api/customers")
            .send({
                phone: "9876543210"
            });
        expect(response.statusCode).toBe(400);
    });

    // POST: Duplicate Email

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

    // GET: All Customers
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
    // GET: Customer By ID

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
    });

    // PATCH: Update Customer

    test("PATCH /api/customers/:id should update customer details", async () => {
        const customer = await Customer.create({
            name: "Rahul Gupta",
            email: "rahul@example.com",
            phone: "9876543210"
        });
        const response = await request(app)
            .patch(`/api/customers/${customer._id}`)
            .send({
                name: "Rahul Sharma"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe("Rahul Sharma");
    });

    // PATCH: Invalid Customer ID

    test("PATCH /api/customers/:id should reject invalid customer ID", async () => {
        const response = await request(app)
            .patch("/api/customers/invalid-id")
            .send({
                name: "Updated Name"
            });
        expect(response.statusCode).toBe(400);
    });

    // DELETE: Delete Customer

    test("DELETE /api/customers/:id should delete a customer", async () => {
        const customer = await Customer.create({
            name: "Rahul Gupta",
            email: "rahul@example.com",
            phone: "9876543210"
        });
        const response = await request(app)
            .delete(`/api/customers/${customer._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        const deletedCustomer = await Customer.findById(customer._id);
        expect(deletedCustomer).toBeNull();
    });

    // DELETE: Non-existing Customer

    test("DELETE /api/customers/:id should return 404 for non-existing customer", async () => {
        const customer = new Customer({
            name: "Temporary Customer",
            email: "temporary@example.com"
        });
        const response = await request(app)
            .delete(`/api/customers/${customer._id}`);
        expect(response.statusCode).toBe(404);
    });
});
