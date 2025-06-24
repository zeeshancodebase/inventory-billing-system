const express = require('express');

const router = express.Router();
const customerController = require('../controllers/customerController'); // Adjust path as needed
// Routes
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;