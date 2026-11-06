const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Customer = require("../models/customer");
const Payment = require("../models/payment");
describe("Customer API Tests", () => {
    beforeAll(async () => {
        await Customer.init();
    });
    beforeEach(async () => {
        await Customer.deleteMany({});
    });
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
    test("GET unknown route should return 404", async () => {
        const response = await request(app).get("/api/unknown");

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });
    test("POST /api/customers should create a customer", async () => {
        const response = await request(app)
            .post("/api/customers")
            .send({
                name: "Rahul Sharma",
                email: "rahul@example.com",
                phone: "9876543210"
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe("Rahul Sharma");
        expect(response.body.data.email).toBe("rahul@example.com");
    });
    test("POST /api/customers should reject missing fields", async () => {
        const response = await request(app)
            .post("/api/customers")
            .send({
                name: "Rahul Sharma"
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });
    test("POST /api/customers should reject duplicate email", async () => {
        await request(app)
            .post("/api/customers")
            .send({
                name: "Rahul Sharma",
                email: "rahul@example.com"
            });
        const response = await request(app)
            .post("/api/customers")
            .send({
                name: "Amit Sharma",
                email: "rahul@example.com"
            });
        expect(response.statusCode).toBe(409);
        expect(response.body.success).toBe(false);
    });
    test("GET /api/customers should return all customers", async () => {
        await Customer.create({
            name: "Rahul Sharma",
            email: "rahul@example.com"
        });
        const response = await request(app).get("/api/customers");
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBe(1);
    });
    test("GET /api/customers/:id should return a customer", async () => {
        const customer = await Customer.create({
            name: "Rahul Sharma",
            email: "rahul@example.com"
        });
        const response = await request(app)
            .get(`/api/customers/${customer._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe("Rahul Sharma");
    });

    test("PATCH /api/customers/:id should update a customer", async () => {
        const customer = await Customer.create({
            name: "Rahul Sharma",
            email: "rahul@example.com"
        });
        const response = await request(app)
            .patch(`/api/customers/${customer._id}`)
            .send({
                name: "Rahul Verma"
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe("Rahul Verma");
    });
    test("GET /api/customers/:id should reject invalid ID", async () => {
        const response = await request(app)
            .get("/api/customers/invalid-id");

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test("DELETE /api/customers/:id should delete a customer", async () => {
        const customer = await Customer.create({
            name: "Rahul Sharma",
            email: "rahul@example.com"
        });

        const response = await request(app)
            .delete(`/api/customers/${customer._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        const deletedCustomer = await Customer.findById(customer._id);
        expect(deletedCustomer).toBeNull();
    });
    test("DELETE /api/customers/:id should return 404 for nonexistent customer", async () => {
        const customerId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .delete(`/api/customers/${customerId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });
});
describe("Payment API Tests", () => {
    let customer;
    beforeAll(async () => {
        await Customer.init();
        await Payment.init();
    });
    beforeEach(async () => {
        await Payment.deleteMany({});
        await Customer.deleteMany({});
        customer = await Customer.create({
            name: "Amit Sharma",
            email: "amit@example.com",
            phone: "9876543210"
        });
    });
    test("POST /api/payments should create a payment", async () => {
        const response = await request(app)
            .post("/api/payments")
            .send({
                customer: customer._id.toString(),
                amount: 50000,
                currency: "INR",
                paymentMethod: "card",
                description: "Test payment"
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.amount).toBe(50000);
        expect(response.body.data.currency).toBe("INR");
        expect(response.body.data.status).toBe("pending");
    });
    test("POST /api/payments should reject missing fields", async () => {
        const response = await request(app)
            .post("/api/payments")
            .send({
                customer: customer._id.toString()
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });
    test("POST /api/payments should return 404 if customer does not exist", async () => {
        const fakeCustomerId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .post("/api/payments")
            .send({
                customer: fakeCustomerId.toString(),
                amount: 50000,
                paymentMethod: "card"
            });
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });
    test("GET /api/payments should return all payments", async () => {
        await Payment.create({
            customer: customer._id,
            amount: 50000,
            currency: "INR",
            paymentMethod: "card",
            description: "Test payment"
        });
        const response = await request(app).get("/api/payments");
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(1);
        expect(response.body.data.length).toBe(1);
    });
    test("GET /api/payments/:id should return a payment", async () => {
        const payment = await Payment.create({
            customer: customer._id,
            amount: 50000,
            currency: "INR",
            paymentMethod: "card"
        });

        const response = await request(app)
            .get(`/api/payments/${payment._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.amount).toBe(50000);
    });
    test("GET /api/payments/:id should return 404 if payment does not exist", async () => {
        const fakePaymentId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/payments/${fakePaymentId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });
});
