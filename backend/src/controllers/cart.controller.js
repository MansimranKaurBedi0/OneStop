const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");


/* ---------------- REUSABLE TOTAL CALCULATOR ---------------- */

const recalcCart = async (cart) => {
  const productIds = cart.items.map(item => item.product);

  const products = await Product.find({ _id: { $in: productIds } });

  const productMap = {};
  products.forEach(p => {
    productMap[p._id] = p;
  });

  let totalAmount = 0;
  let totalItems = 0;

  for (let item of cart.items) {
    const prod = productMap[item.product];

    if (!prod || !prod.isActive || prod.stock === 0) continue;

    // ensure quantity never exceeds stock
    if (item.quantity > prod.stock) {
      item.quantity = prod.stock;
    }

    totalAmount += prod.price * item.quantity;
    totalItems += item.quantity;
  }

  cart.totalAmount = totalAmount;
  cart.totalItems = totalItems;
  cart.finalAmount = totalAmount - (cart.discount || 0);
};



/* ---------------- ADD TO CART ---------------- */

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user;
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product || !product.isActive)
      return res.status(404).json({ message: "Product not available" });

    if (product.stock < 1)
      return res.status(400).json({ message: "Product out of stock" });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity: 1 }]
      });
    } else {

      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {

        const currentQty = cart.items[itemIndex].quantity;

        if (currentQty + 1 > product.stock) {
          return res.status(400).json({
            message: `Only ${product.stock} items available`
          });
        }

        cart.items[itemIndex].quantity += 1;

      } else {

        cart.items.push({
          product: productId,
          quantity: 1
        });
      }
    }

    await recalcCart(cart);
    await cart.save();

    res.json({ message: "Added to cart", cart });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



/* ---------------- GET CART ---------------- */

exports.getCart = async (req, res) => {
  try {

    const user = await User.findById(req.user).select("coins");

    const cart = await Cart.findOne({ user: req.user })
      .populate("items.product", "name price image stock");

    const availableCoins = user?.coins ?? 0;

    if (!cart) {
      return res.json({
        items: [],
        totalAmount: 0,
        totalItems: 0,
        availableCoins
      });
    }

    res.json({
      items: cart.items,
      totalAmount: cart.totalAmount,
      totalItems: cart.totalItems,
      availableCoins
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



/* ---------------- REMOVE FROM CART ---------------- */

exports.removeFromCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({ user: req.user });
    if (!cart)
      return res.status(404).json({ message: "Cart not found" });

    const productId = req.params.id;

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await recalcCart(cart);
    await cart.save();

    res.json({ message: "Item removed", cart });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



/* ---------------- UPDATE QUANTITY ---------------- */

exports.updateCartItem = async (req, res) => {
  try {

    const { quantity } = req.body;
    const productId = req.params.id;

    if (quantity < 1)
      return res.status(400).json({ message: "Invalid quantity" });

    const cart = await Cart.findOne({ user: req.user });
    if (!cart)
      return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      i => i.product.toString() === productId
    );

    if (!item)
      return res.status(404).json({ message: "Item not in cart" });

    const product = await Product.findById(productId);

    if (!product || !product.isActive)
      return res.status(404).json({ message: "Product not available" });

    if (quantity > product.stock)
      return res.status(400).json({
        message: `Only ${product.stock} available`
      });

    item.quantity = quantity;

    await recalcCart(cart);
    await cart.save();

    res.json({ message: "Cart updated", cart });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
