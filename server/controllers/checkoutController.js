const mongoose = require('mongoose');
const Sale = require('../models/saleModel');
const Invoice = require('../models/invoiceModel');
const Product = require("../models/productModel");
const Counter = require("../models/counterModel");



const checkout = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const saleData = req.body;

        const salesManId = req.user._id;
        if (!salesManId) {
            return res.status(401).json({ message: "Unauthorized: Salesman ID missing" });
        }

        const generateInvoiceId = async () => {
            const today = new Date();
            const year = today.getFullYear().toString().slice(-2);
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            const datePart = `${year}${month}${day}`;

            const counterId = `invoice_${datePart}`;

            const counter = await Counter.findByIdAndUpdate(
                counterId,
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const formattedSeq = String(counter.seq).padStart(3, "0");
            return `RT${datePart}${formattedSeq}`;
        };

        const invoiceId = await generateInvoiceId();


        // Fetch products in cart
        const prodIds = saleData.cart.map(item => item.prodId);
        const products = await Product.find({ prodId: { $in: prodIds } }).session(session);

        const productMap = new Map(products.map(p => [p.prodId, p]));

        // Stock validation
        for (const item of saleData.cart) {
            const product = productMap.get(item.prodId);
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Product ${item.prodId} not found` });
            }

            if (item.prodType === "roll") {
                if (product.totalLength < item.quantity) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ message: `Not enough stock for ${item.prodId}` });
                }
            } else {
                if (product.quantity < item.quantity) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ message: `Not enough stock for ${item.prodId}` });
                }
            }
        }

        // Recalculate subTotal
        const round2 = (num) => Math.round(num * 100) / 100;

        let subTotal = 0;
        for (const item of saleData.cart) {
            subTotal += item.sellingPrice * item.quantity;
        }
        subTotal = round2(subTotal);
        // Recalculate discount and grand total (like frontend logic)
        let discount = 0;
        let grandTotal = subTotal;

        if (saleData.amountReceived > 0 && saleData.amountReceived < subTotal) {
            discount = subTotal - saleData.amountReceived;
            grandTotal = saleData.amountReceived;
        }

        // Calculate total cost from cart
        let totalCost = 0;
        for (const item of saleData.cart) {
            totalCost += item.costPrice * item.quantity;
        }

        // Calculate profit
        const profit = grandTotal - totalCost;

        // Validate against client-sent data
        if (
            saleData.subTotal !== subTotal ||
            saleData.discount !== discount ||
            saleData.totalCost !== totalCost ||
            saleData.profit !== profit ||
            saleData.grandTotal !== grandTotal
        ) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Mismatch in subTotal, discount or grand total. Please refresh and try again." });
        }

        // Validate amountReceived is enough to cover grandTotal
        if (saleData.amountReceived < grandTotal) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Amount received is less than total amount payable." });
        }

        // Deduct stock in-memory
        for (const item of saleData.cart) {
            const product = productMap.get(item.prodId);
            if (item.prodType === "roll") {
                product.totalLength -= item.quantity;
            } else {
                product.quantity -= item.quantity;
            }
        }

        // Save all updated products
        await Promise.all(
            Array.from(productMap.values()).map(product => product.save({ session }))
        );

        // Save sale document
        const newSale = new Sale({
            ...saleData,
            // salesManId,
            invoiceId,
            subTotal,
            grandTotal,
            discount,
            amountReceived: saleData.amountReceived,
            totalCost,
            profit
        });

        const savedSale = await newSale.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(savedSale);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error creating sale:", error);
        // res.status(500).json({ error: "Failed to create sale" });
        next(error);
    }
};


module.exports = { checkout };







// // Create a Invoice entry
// const invoice = new Invoice({
//     saleId: savedSale._id,
//     invoiceId,
//     amountDue,
//     paymentMethod,
//     amountReceived,
//     status: amountReceived >= amountDue ? 'Paid' : 'Pending',

// });

// const savedInvoice = await invoice.save();




// Create an Invoice entry
// const sale = new Sale({
//     saleId: savedSale._id,
//     invoiceId,
//     amountDue: totalAfterDiscount - amountReceived,
//     paymentMethod,
//     amountReceived,
//     status: amountReceived >= totalAfterDiscount ? 'Paid' : 'Pending',
// });

// const savedSale = await sale.save();

// // Create a Sale entry
// const invoice = new Invoice({
//     customerMobile,
//     customerName,
//     customerAddress,
//     cart,
//     totalAmount,
//     totalDiscount,
//     totalAfterDiscount,
//     paymentMethod,
//     amountReceived,
//     status: amountReceived >= totalAfterDiscount ? 'Paid' : 'Pending',
// });

// const savedInvoice = await invoice.save();

// Generate an Invoice number
// const invoiceNumber = generateInvoiceNumber(savedSale._id);

// Return the response with sale and invoice details
