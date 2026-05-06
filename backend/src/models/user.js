const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:     { type: String, default: "" },
  email:    { type: String, unique: true },
  password: { type: String, default: "" },
  phone:    { type: String, default: "" },
  avatar:   { type: String, default: "" },   // stores filename, e.g. "avatar-123.jpg"
  googleId: { type: String, default: "" },
}, { timestamps: true });

// Prevent OverwriteModelError on hot-reload (nodemon)
module.exports = mongoose.models.User || mongoose.model("User", userSchema);