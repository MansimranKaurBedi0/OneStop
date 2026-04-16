const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");


// ================= PLACE ORDER =================
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { coinsUsed = 0, paymentMethod } = req.body;

    if (!paymentMethod)
      return res.status(400).json({ message: "Payment method required" });

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart empty" });

    let orderItems = [];
    let totalAmount = 0;

    // ----- STOCK VALIDATION + ATOMIC REDUCE -----
    for (let item of cart.items) {
      const product = item.product;

      if (!product)
        return res.status(400).json({ message: "Product no longer exists" });

      if (!product.isActive)
        return res.status(404).json({ message: "Product not available" });

      const updated = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updated)
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // ----- USER CHECK -----
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (coinsUsed > user.coins)
      return res.status(400).json({ message: "Not enough coins" });

    if (coinsUsed > totalAmount)
      return res.status(400).json({
        message: "Coins cannot exceed order amount",
      });

    const finalAmount = totalAmount - coinsUsed;

    // ----- STATUS DECISION -----
    let status = paymentMethod === "ONLINE"
      ? "PAYMENT_PENDING"
      : "PLACED";

    // ----- CREATE ORDER -----
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      finalAmount,
      coinsUsed,
      paymentMethod,
      status,
      coinsEarned: 0,
      statusHistory: [{ status, date: new Date() }],
    });

    // deduct coins
    if (coinsUsed > 0) {
      user.coins -= coinsUsed;
      await user.save();
    }

    // clear cart
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      status,
    });

  } catch (err) {
    console.log("❌ PLACE ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// ================= MY ORDERS =================
exports.myOrders = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user })
        .populate("items.product", "name price") // optional if product ref used
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Order.countDocuments({ user: req.user }),
    ]);

    res.json({
      data: orders,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (err) {
    console.log("❌ MY ORDERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ================= ADMIN: ALL ORDERS =================
exports.getAllOrders = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ isDeleted: { $ne: true } })
        .populate("user", "name phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Order.countDocuments({ isDeleted: { $ne: true } }),
    ]);

    res.json({
      data: orders,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (err) {
    console.log("❌ ADMIN ORDERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// ================= ADMIN: UPDATE STATUS =================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const flow = {
      PLACED: "CONFIRMED",
      CONFIRMED: "OUT_FOR_DELIVERY",
      OUT_FOR_DELIVERY: "DELIVERED",
    };

    const order = await Order.findById(id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    const nextStatus = flow[order.status];

    if (!nextStatus)
      return res.status(400).json({ message: "Invalid current status" });

    if (status !== nextStatus)
      return res.status(400).json({
        message: `Allowed status: ${nextStatus}`,
      });

    // ⭐ FIX HERE
    if (!order.statusHistory) order.statusHistory = [];

    order.status = status;
    order.statusHistory.push({ status, date: new Date() });

    // reward coins
    if (status === "DELIVERED" && order.coinsEarned === 0) {
      const user = await User.findById(order.user);
      const reward = Math.floor(order.totalAmount * 0.1);

      user.coins += reward;
      order.coinsEarned = reward;

      await user.save();
    }

    await order.save();

    res.json({ message: "Status updated", status });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= ADMIN: SOFT DELETE ORDER =================
exports.softDeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (order.status !== "DELIVERED")
      return res.status(400).json({ message: "Only delivered orders can be deleted" });

    order.isDeleted = true;
    await order.save();

    res.json({ message: "Order soft deleted successfully" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

