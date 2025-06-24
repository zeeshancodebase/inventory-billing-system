const Customer = require('../models/customer'); // Adjust path as needed

// Create a new customer
const createCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all customers or customer by mobile number
const getCustomers = async (req, res) => {
    try {
        const { mobile } = req.query;
        let customers;
        if (mobile) {
            customers = await Customer.find({ customerMobile: mobile });
        } else {
            customers = await Customer.find();
        }
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single customer by ID
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a customer by ID
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json(customer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a customer by ID
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer };