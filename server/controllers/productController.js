const Product = require('../models/productModel');

// Controller for adding a product
const addProduct = async (req, res, next) => {
    try {
        const {
            prodType,
            prodName,
            category,
            sku,
            quantity,
            costPrice,
            sellingPrice,
            lengthPerRoll,
            type,
            color,
            // image,
            minimumStock
        } = req.body;

        // Validate required fields
        if (!quantity || !sellingPrice ||!costPrice) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 🧮 Calculate totalLength if lengthPerRoll is provided
        let totalLength;
        if (lengthPerRoll && quantity) {
            const parsedLength = parseFloat(lengthPerRoll);
            const parsedQty = parseFloat(quantity);
            if (!isNaN(parsedLength) && !isNaN(parsedQty)) {
                totalLength = parsedLength * parsedQty;
            }
        }

        // Create a new product
        const newProduct = new Product({
            prodType,
            prodName,
            category,
            sku,
            quantity,
            costPrice,
            sellingPrice,
            lengthPerRoll,
            totalLength,
            type,
            color,
            image: "Rehmat-Textile-Logo.jpg",
            minimumStock: minimumStock
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        res.status(201).json({ message: 'Product added successfully', product: savedProduct });
    } catch (error) {
        next(error);
    }
};

// 🔽 NEW: Get all products
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }); // Latest first
        res.status(200).json({ products });
    } catch (error) {
        next(error);
    }
};


const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};


const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        next(error);
    }
};



module.exports = { addProduct, getAllProducts, deleteProduct, updateProduct };