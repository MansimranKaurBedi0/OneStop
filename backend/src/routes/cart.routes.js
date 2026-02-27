const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem
} = require("../controllers/cart.controller");

router.post("/add", auth, addToCart);
router.get("/", auth, getCart);
router.delete("/:id", auth, removeFromCart);
router.patch("/:id", auth, updateCartItem);

module.exports = router;
