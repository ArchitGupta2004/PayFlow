const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation failed";
    }
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    }
    if (err.code === 11000) {
        statusCode = 409;
        message = "Duplicate field value";
    }
    res.status(statusCode).json({
        success: false,
        message: message
    });
};
module.exports = errorMiddleware;
