const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

// admin only
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
