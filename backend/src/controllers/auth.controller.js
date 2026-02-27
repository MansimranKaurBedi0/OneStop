const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, phone, password, address } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      phone,
      password: hashedPassword,
      address,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("REGISTER ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { phone, password, loginType } = req.body; // 🔹 added loginType

    if (!phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 admin login validation
    if (loginType === "admin" && user.role !== "admin") {
      return res.status(403).json({ message: "Not an admin account" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, // 🔹 role added
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        coins: user.coins,
        role: user.role, // 🔹 role sent to frontend
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
