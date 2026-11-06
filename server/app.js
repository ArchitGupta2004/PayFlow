const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const paymentRoutes = require("./routes/paymentRoutes");
const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
// Root Route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to PayFlow API",
        status: "Server is running"
    });
});

// Health Check Route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "PayFlow API is healthy"
    });
});

// Customer Routes
app.use("/api/customers", customerRoutes);
app.use("/api/payments", paymentRoutes);
// 404 Handler - For undefined routes
app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.statusCode = 404;
    next(error);
});

// Centralized Error Handler
app.use(errorMiddleware);
module.exports = app;