const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access denied" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
