const Payment = require("../models/payment");
const Customer = require("../models/customer");
// 1. Create Payment
const createPayment = async (req, res, next) => {
    try {
        const {
            customer,
            amount,
            currency,
            paymentMethod,
            description
        } = req.body;

        // Check required fields
        if (!customer || !amount || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Customer, amount and payment method are required"
            });
        }

        // Check if customer exists
        const existingCustomer = await Customer.findById(customer);

        if (!existingCustomer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Create payment
        const payment = await Payment.create({
            customer,
            amount,
            currency,
            paymentMethod,
            description
        });

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: payment
        });

    } catch (error) {
        next(error);
    }
};
// 2. Get All Payments
const getPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find()
            .populate("customer", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        next(error);
    }
};


// 3. Get Payment By ID
const getPaymentById = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate("customer", "name email");

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: payment
        });

    } catch (error) {
        next(error);
    }
};
module.exports = {createPayment,getPayments,getPaymentById};