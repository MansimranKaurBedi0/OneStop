
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

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


app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174"
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin) || !process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

// Apply rate limiting to all /api routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: { message: "Too many requests from this IP, please try again after 15 minutes." },
  standardHeaders: true, 
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

module.exports = app;
