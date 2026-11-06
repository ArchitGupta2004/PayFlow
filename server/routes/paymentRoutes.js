const express = require("express");
const router = express.Router();
const {
    createPayment,
    getPayments,
    getPaymentById
} = require("../controllers/paymentController");
router.post("/", createPayment);
router.get("/", getPayments);
router.get("/:id", getPaymentById);
module.exports = router;