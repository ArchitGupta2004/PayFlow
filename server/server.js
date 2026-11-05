
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const customerRoutes = require("./routes/customerRoutes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/customers", customerRoutes);
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

const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`PayFlow server running on port ${PORT}`);
    });
};

startServer();