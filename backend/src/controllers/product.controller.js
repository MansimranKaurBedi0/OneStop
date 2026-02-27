const Product = require("../models/Product");

// ADMIN: add product
exports.addProduct = async (req, res) => {
  try {
    const { name, price, stock, category, image } = req.body;

    if (!name || price == null || stock == null || !category) {
      return res.status(400).json({ message: "All fields required" });
    }
    if (price < 0 || stock < 0) {
      return res.status(400).json({ message: "Invalid price/stock" });
    }

    const product = await Product.create({
      name,
      price,
      stock,
      category,
      image,
    });

    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUBLIC: list active products
exports.getProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments({ isActive: true }),
    ]);

    res.json({
      data: products,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ADMIN: update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.price < 0 || updates.stock < 0) {
      return res.status(400).json({ message: "Invalid price/stock" });
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
