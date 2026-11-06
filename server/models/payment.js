const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: [1, "Amount must be greater than zero"],
            validate: {
                validator: Number.isInteger,
                message: "Amount must be an integer"
            }
        },
        currency: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            default: "INR",
            minlength: 3,
            maxlength: 3
        },
        status: {
            type: String,
            enum: ["pending", "processing", "succeeded", "failed"],
            default: "pending"
        },
        paymentMethod: {
            type: String,
            enum: ["card", "upi", "netbanking", "wallet"],
            required: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500
        },
        idempotencyKey: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },
        providerPaymentId: {
            type: String,
            trim: true,
            default: null
        }
    },
    {
        timestamps: true
    }
);
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;