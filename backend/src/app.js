
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const adminOrderRoutes = require("./routes/order.admin.routes");
const cartRoutes = require("./routes/cart.routes");

const app = express();
// app.use((req, res, next) => {
//   console.log("HIT:", req.method, req.url);
//   next();
// });


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

module.exports = app;
