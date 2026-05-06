const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/eventController");

router.get("/", authMiddleware, getEvents);
router.post("/", authMiddleware, createEvent);
router.put("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

module.exports = router;
