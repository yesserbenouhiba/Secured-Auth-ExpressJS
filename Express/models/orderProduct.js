const mongoose = require("mongoose");

const orderProductSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    }, // Foreign key to Order model
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }, // Foreign key to Product model
    quantity: { type: Number, required: true }, // Quantity of the product in the order
  },
  { timestamps: true }
);

const OrderProduct = mongoose.model("OrderProduct", orderProductSchema);
module.exports = OrderProduct;
