const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  updateProduct,
} = require("../controllers/product.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// admin routes (temporarily auth-protected)
router.post("/", authMiddleware, adminMiddleware, addProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);


// public
router.get("/", getProducts);

module.exports = router;
