const mongoose = require("mongoose");
const Sale = require("../models/saleModel");
const Product = require("../models/productModel");


const getSaleById = async (req, res, next) => {
    try {
        const sale = await Sale.findOne({ invoiceId: req.params.invoiceId }).populate('salesManId');
        if (!sale) return res.status(404).json({ message: "Sale not found" });

        res.status(200).json(sale);
    } catch (err) {
        next(err);
    }
};

const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find().sort({ createdAt: -1 }).populate('salesManId');
        res.status(200).json(sales);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const cancelSale = async (req, res, next) => {
    const { invoiceId } = req.params;

    if (!req.user.isAdmin) {
        return res.status(401).json({ message: "Unauthorized: You are not allowed to cancel this sale" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Find the sale
        const sale = await Sale.findOne({ invoiceId }).session(session);

        if (!sale) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Sale not found" });
        }

        if (sale.status === "cancelled") {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Sale is already cancelled" });
        }

        // 2. Fetch all products involved
        const prodIds = sale.cart.map(item => item.prodId);
        const products = await Product.find({ prodId: { $in: prodIds } }).session(session);

        const productMap = new Map(products.map(p => [p.prodId, p]));

        // 3. Reverse stock
        for (const item of sale.cart) {
            const product = productMap.get(item.prodId);
            if (!product) continue; // Edge case: product deleted

            if (item.prodType === "roll") {
                product.totalLength += item.quantity;
            } else {
                product.quantity += item.quantity;
            }
        }

        // 4. Save updated products
        await Promise.all(
            Array.from(productMap.values()).map(p => p.save({ session }))
        );

        // 5. Update sale status
        sale.status = "cancelled";
        sale.cancelledAt = new Date();
        sale.cancelledBy = req.user._id; // assuming auth middleware

        await sale.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Sale cancelled successfully", sale });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error cancelling sale:", err);
        next(err);
    }
};


const returnSale = async (req, res, next) => {
    const { saleId } = req.params;
    const { itemsToReturn } = req.body; // cart-like structure: [{ prodId, quantity, prodType }]

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const originalSale = await Sale.findById(saleId).session(session);
        if (!originalSale) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Original sale not found" });
        }

        // Map original cart for validation
        const originalCartMap = new Map();
        for (const item of originalSale.cart) {
            originalCartMap.set(item.prodId, item);
        }

        const prodIds = itemsToReturn.map(i => i.prodId);
        const products = await Product.find({ prodId: { $in: prodIds } }).session(session);
        const productMap = new Map(products.map(p => [p.prodId, p]));

        let refundAmount = 0;
        const returnCart = [];

        for (const item of itemsToReturn) {
            const originalItem = originalCartMap.get(item.prodId);
            if (!originalItem || item.quantity > originalItem.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Invalid return quantity for ${item.prodId}` });
            }

            const product = productMap.get(item.prodId);
            if (!product) continue;

            // Update stock
            if (item.prodType === "roll") {
                product.totalLength += item.quantity;
            } else {
                product.quantity += item.quantity;
            }

            await product.save({ session });

            const sellingPrice = originalItem.sellingPrice;
            refundAmount += sellingPrice * item.quantity;

            returnCart.push({
                prodId: item.prodId,
                prodType: item.prodType,
                quantity: item.quantity,
                sellingPrice: sellingPrice,
                costPrice: originalItem.costPrice
            });
        }

        // Create return record (as a negative sale)
        const returnSale = new Sale({
            cart: returnCart,
            isReturn: true,
            returnOf: saleId,
            subTotal: refundAmount,
            discount: 0,
            grandTotal: refundAmount,
            totalCost: 0,
            profit: -refundAmount,
            amountReceived: -refundAmount, // treated as refund issued
            invoiceId: `RET-${originalSale.invoiceId}`,
            status: "completed",
            salesManId: req.user._id
        });

        await returnSale.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: "Return processed successfully", returnSale });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error processing return:", error);
        next(error);
    }
};




module.exports = { getAllSales, getSaleById, cancelSale, returnSale };