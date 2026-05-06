require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

console.log("🎬 Starting server...");

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB().then(() => {
  // Start Server only after DB attempt (optional, but safer for logging)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  });
}).catch(err => {
  console.error("💥 Failed to start server:", err.message);
  process.exit(1);
});





