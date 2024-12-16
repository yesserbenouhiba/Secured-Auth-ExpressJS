const mongoose = require("mongoose");

const cartProductSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    }, // Foreign key to Cart model
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }, // Foreign key to Product model
    quantity: { type: Number, required: true }, // Quantity of the product in the cart
  },
  { timestamps: true }
);

const CartProduct = mongoose.model("CartProduct", cartProductSchema);
module.exports = CartProduct;
