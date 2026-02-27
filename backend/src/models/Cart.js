const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    items: [cartItemSchema],

    totalAmount: {
      type: Number,
      default: 0
    },

    totalItems: {
      type: Number,
      default: 0
    },

    coinsUsed: {
      type: Number,
      default: 0,
      min: 0
    },

    discount: {
      type: Number,
      default: 0
    },

    finalAmount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
