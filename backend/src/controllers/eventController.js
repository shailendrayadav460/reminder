const Event = require("../models/Event");

// GET /api/events — get all events for logged-in user
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// POST /api/events — create a new event
exports.createEvent = async (req, res) => {
  try {
    const { name, rel, type, date, phone, email, notes, days } = req.body;
    if (!name || !rel || !type || !date) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }
    const event = await Event.create({
      user: req.user._id,
      name,
      rel,
      type,
      date,
      phone: phone || "",
      email: email || "",
      notes: notes || "",
      days: days || 1,
      sent: 0,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// PUT /api/events/:id — update an event
exports.updateEvent = async (req, res) => {
  try {
    const { name, rel, type, date, phone, email, notes, days } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    // Ensure user owns the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    event.name = name || event.name;
    event.rel = rel || event.rel;
    event.type = type || event.type;
    event.date = date || event.date;
    event.phone = phone !== undefined ? phone : event.phone;
    event.email = email !== undefined ? email : event.email;
    event.notes = notes !== undefined ? notes : event.notes;
    event.days = days !== undefined ? days : event.days;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE /api/events/:id — delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    // Ensure user owns the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await event.deleteOne();
    res.json({ msg: "Event deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
