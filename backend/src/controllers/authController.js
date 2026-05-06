const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Clean user object — never send password to client
const sanitizeUser = (user) => ({
  _id:      user._id,
  name:     user.name,
  email:    user.email,
  joinDate: user.createdAt,
});

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    user = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password: hashed,
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ msg: "Invalid email or password" });

    // Google-only accounts won't have a password
    if (!user.password) {
      return res.status(400).json({ msg: "Please sign in with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

    const token = generateToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};

// Google OAuth success callback
exports.googleSuccess = (req, res) => {
  const token = generateToken(req.user);
  res.json({ token, user: sanitizeUser(req.user) });
};