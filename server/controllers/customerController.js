
const Customer = require("../models/customer");
// 1. Create Customer
const createCustomer = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }
        const customer = await Customer.create({
            name,
            email,
            phone
        });
        return res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: customer
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Customer email already exists"
            });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to create customer"
        });
    }
};


// 2. Get All Customers
const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        return res.status(200).json({
            success: true,
            count: customers.length,
            data: customers
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch customers"
        });
    }
};


// 3. Get Customer By ID
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to fetch customer"
        });
    }
};


// 4. Update Customer
const updateCustomer = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (email !== undefined) updates.email = email;
        if (phone !== undefined) updates.phone = phone;
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required for update"
            });
        }
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { returnDocument: "after", runValidators: true }
        );
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: customer
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Customer email already exists"
            });
        }
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID"
            });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update customer"
        });
    }
};


// 5. Delete Customer
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(
            req.params.id
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Customer deleted successfully"
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to delete customer"
        });
    }
};



// Export Controllers
module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};
