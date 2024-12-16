const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderDate: { type: Date, default: Date.now },
    shippingAddress: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
