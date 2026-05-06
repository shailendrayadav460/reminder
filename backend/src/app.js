const express = require("express");
const passport = require("passport");
const cors = require("cors");

const app = express();

// CORS — allow React dev server
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
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
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;