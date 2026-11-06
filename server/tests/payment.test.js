const mongoose = require("mongoose");
const Payment = require("../models/payment");

describe("Payment Model Tests", () => {
    test("Should create a valid payment", async () => {
        const payment = new Payment({
            customer: new mongoose.Types.ObjectId(),
            amount: 50000,
            paymentMethod: "card"
        });

        await expect(payment.validate()).resolves.toBeUndefined();
    });

    test("Should reject zero amount", async () => {
        const payment = new Payment({
            customer: new mongoose.Types.ObjectId(),
            amount: 0,
            paymentMethod: "card"
        });

        await expect(payment.validate()).rejects.toThrow();
    });

    test("Should reject decimal amount", async () => {
        const payment = new Payment({
            customer: new mongoose.Types.ObjectId(),
            amount: 500.50,
            paymentMethod: "card"
        });

        await expect(payment.validate()).rejects.toThrow();
    });

    test("Should reject missing customer", async () => {
        const payment = new Payment({
            amount: 50000,
            paymentMethod: "card"
        });

        await expect(payment.validate()).rejects.toThrow();
    });

    test("Should reject invalid payment method", async () => {
        const payment = new Payment({
            customer: new mongoose.Types.ObjectId(),
            amount: 50000,
            paymentMethod: "bitcoin"
        });

        await expect(payment.validate()).rejects.toThrow();
    });

    test("Should use default currency and status", () => {
        const payment = new Payment({
            customer: new mongoose.Types.ObjectId(),
            amount: 50000,
            paymentMethod: "upi"
        });

        expect(payment.currency).toBe("INR");
        expect(payment.status).toBe("pending");
    });
});