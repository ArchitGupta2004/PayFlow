
const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to PayFlow API",
        status: "Server is running"
    });
});
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "PayFlow API is healthy"
    });
});
app.use("/api/customers", customerRoutes);
module.exports = app;
