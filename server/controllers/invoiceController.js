const Invoice = require('../models/invoiceModel');
const Sale = require('../models/saleModel');
const { generateInvoiceNumber } = require('../utils/invoiceGenerator');

// Create an invoice
const createInvoice = async (req, res) => {
  try {
    const { saleId, paymentMethod, amountPaid } = req.body;

    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const invoiceNumber = generateInvoiceNumber(saleId);
    const amountDue = sale.totalCost - sale.discount - amountPaid;

    const newInvoice = new Invoice({
      saleId,
      invoiceNumber,
      totalAmount: sale.totalCost - sale.discount,
      amountPaid,
      amountDue,
      paymentMethod,
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(500).json({ message: 'Error creating invoice', error });
  }
};

// Get invoice details by ID
const getInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;
    const invoice = await Invoice.findById(invoiceId).populate('saleId');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice', error });
  }
};

module.exports = { createInvoice, getInvoiceById };
