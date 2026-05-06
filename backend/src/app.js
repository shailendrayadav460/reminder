const express = require("express");
const passport = require("passport");
const cors = require("cors");

const app = express();
const fs = require("fs");
const path = require("path");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


// CORS — allow frontend (reflecting origin for live environments)
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(passport.initialize());
require("./config/passport"); // load Google strategy

// Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/profile", profileRoutes);

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;