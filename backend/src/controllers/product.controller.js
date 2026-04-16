const Product = require("../models/Product");
const redisClient = require("../config/redis");

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
    
    // Invalidate product cache
    if (redisClient.isReady) {
      const keys = await redisClient.keys("products:*");
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }

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

    const cacheKey = `products:page=${page}:limit=${limit}`;

    if (redisClient.isReady) {
      const cachedProducts = await redisClient.get(cacheKey);
      if (cachedProducts) {
        return res.json(JSON.parse(cachedProducts));
      }
    }

    const [products, total] = await Promise.all([
      Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments({ isActive: true }),
    ]);

    const responseData = {
      data: products,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };

    if (redisClient.isReady) {
      // Setup TTL cache of 5 minutes
      await redisClient.set(cacheKey, JSON.stringify(responseData), {
        EX: 300
      });
    }

    res.json(responseData);
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

    // Invalidate product cache
    if (redisClient.isReady) {
      const keys = await redisClient.keys("products:*");
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }

    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
