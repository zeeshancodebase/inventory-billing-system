// routers/saleRoutes.js

const express = require('express');
const router = express.Router();
const saleController = require("../controllers/saleController.js");
const checkoutController = require("../controllers/checkoutController.js");
const authMiddleware = require('../middlewares/authMiddleware.js');


router.post("/checkout", authMiddleware, checkoutController.checkout);
router.get("/getSaleById/:invoiceId", saleController.getSaleById);        // View one invoice/sale
router.get("/getAllSales", saleController.getAllSales);           // List all sales
router.put('/sales/:invoiceId/cancel', authMiddleware, saleController.cancelSale);


// router.post("/checkout", checkoutController.checkout);           // Create new sale (checkout)
module.exports = router;


