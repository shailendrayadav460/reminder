const User    = require("../models/user");
const bcrypt  = require("bcryptjs");
const path    = require("path");
const fs      = require("fs");

// Sanitize user for response — never send password
const sanitizeUser = (user) => ({
  _id:      user._id,
  name:     user.name,
  email:    user.email,
  phone:    user.phone || "",
  avatar:   user.avatar || "",
  joinDate: user.createdAt,
});

// GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// PUT /api/profile  — update name and/or phone
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const update = {};
    if (name  !== undefined) update.name  = name.trim();
    if (phone !== undefined) update.phone = phone.trim();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "Profile updated", user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// PUT /api/profile/password  — change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Both current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Google-only accounts have no password
    if (!user.password) {
      return res.status(400).json({ msg: "Cannot change password for Google accounts" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// POST /api/profile/avatar  — upload profile image (multer handles the file)
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    // Delete old avatar if exists
    const current = await User.findById(req.user._id).select("avatar");
    if (current?.avatar) {
      const oldPath = path.join(__dirname, "../../uploads", current.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: req.file.filename } },
      { new: true }
    ).select("-password");

    res.json({ msg: "Avatar uploaded", user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
