const express = require("express");
const {
  createInvoice,
  getInvoices,
  getInvoicebyId,
  updateInvoice,
  deleteInvoice,
  generateInvoicePDF,
} = require("../controllers/invoiceController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
// Invoice routes
router.post("/invoices", authenticate, isAdmin, createInvoice);
router.get("/invoices", authenticate, getInvoices);
router.get("/invoices/:id", authenticate, getInvoicebyId);
router.patch("/invoices/:id", authenticate, isAdmin, updateInvoice);
router.delete("/invoices/:id", authenticate, isAdmin, deleteInvoice);
router.get("/invoices/:id/pdf", authenticate, generateInvoicePDF);

module.exports = router;
