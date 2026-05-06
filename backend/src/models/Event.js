const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  rel: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  notes: { type: String, default: "" },
  days: { type: Number, default: 1 },
  sent: { type: Number, default: 0 }
});

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
