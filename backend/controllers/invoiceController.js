const Invoice = require("../models/invoice");
const User = require("../models/user");
const PDFDocument = require("pdfkit");

//Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const { customerDetails, invoiceDate, dueDate, items, taxRates, discount } =
      req.body;
    const totalAmount = calculateTotal(items, taxRates, discount);
    const user = await User.findOne({
      email: customerDetails.email,
      role: "User",
    });
    const invoice = await Invoice.create({
      invoiceNumber: generateInvoiceNumber(),
      customerDetails,
      invoiceDate,
      dueDate,
      items,
      taxRates,
      paymentStatus: "Pending",
      discount,
      totalAmount,
      user: user ? user._id : req.user._id,
    });
    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//Get all invoices
exports.getInvoices = async (req, res) => {
  try {
    const { role, email, _id } = req.user;

    let invoices;
    if (role === "Admin") {
      invoices = await Invoice.find();
    } else {
      invoices = await Invoice.find({
        $or: [{ user: _id }, { "customerDetails.email": email }],
      });
    }

    res
      .status(200)
      .json({ message: "Invoices fetched successfully", invoices });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//Get invoice by id
exports.getInvoicebyId = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice fetched successfully", invoice });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json({ message: "Invoice updated successfully", invoice });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//Generate invoice PDF
exports.generateInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    doc
      .fontSize(20)
      .text(`Invoice ${invoice.invoiceNumber}`, { align: "center" });
    doc.moveDown();

    doc.fontSize(16).text("Customer Details:");
    doc.text(`Name: ${invoice.customerDetails.name}`);
    doc.text(`Email: ${invoice.customerDetails.email}`);
    doc.text(`Phone: ${invoice.customerDetails.phone}`);
    doc.text(`Address: ${invoice.customerDetails.address}`);
    doc.moveDown();

    doc.text(
      `Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`
    );
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);
    doc.moveDown();

    doc.text("Items: ", { underline: true });
    invoice.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} - Quantity: ${item.quantity} - Price: Rs ${
          item.price
        }`
      );
    });
    doc.moveDown();

    doc.text(`Tax Rates: ${invoice.taxRates.join("%, ")}%`);
    doc.moveDown();

    doc.text(`Discount: ${invoice.discount}%`);
    doc.text(`Total Amount: Rs ${invoice.totalAmount}`);
    doc.moveDown();

    doc.text(`Payment Status: ${invoice.paymentStatus}`);
    doc.moveDown();

    doc.text("Thank you for your business!", { align: "center" });
    doc.moveDown();

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//Helper Functions
function calculateTotal(items, taxRates, discount = 0) {
  const subtotal =
    items && items.length > 0
      ? items.reduce((sum, item) => sum + item.quantity * item.price, 0)
      : 0;
  const taxAmount = (taxRates || []).reduce(
    (sum, rate) => sum + (subtotal * rate) / 100,
    0
  );
  let totalAmount = subtotal + taxAmount - discount;
  return parseFloat(totalAmount.toFixed(2));
}

function generateInvoiceNumber() {
  return `INV-${Date.now()}`;
}
