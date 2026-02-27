const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  placeOrder,
  myOrders,
} = require("../controllers/order.controller");

// user
router.post("/", authMiddleware, placeOrder);
router.get("/my", authMiddleware, myOrders);

module.exports = router;
