const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return `INV-${Date.now()}`;
    },
  },
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true, default: " " },
    phone: { type: String, required: true },
    address: { type: String, required: false },
  },
  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  items: [itemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: function () {
      return this.items && Array.isArray(this.items) && this.items.length > 0
        ? this.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
        : 0;
    },
  },
  taxRates: [{ type: Number }],
  paymentStatus: {
    type: String,
    required: true,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending",
  },
  discount: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

invoiceSchema.pre("save", function (next) {
  const totalBeforeTax =
    this.items && Array.isArray(this.items) && this.items.length > 0
      ? this.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
      : 0;

  const taxAmount =
    this.taxRates && Array.isArray(this.taxRates) && this.taxRates.length > 0
      ? this.taxRates.reduce(
          (sum, rate) => sum + (totalBeforeTax * rate) / 100,
          0
        )
      : 0;

  const discountAmount = (totalBeforeTax + taxAmount) * (this.discount / 100);

  this.totalAmount = totalBeforeTax + taxAmount - discountAmount;

  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
