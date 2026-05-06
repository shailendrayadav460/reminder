const router = require("express").Router();
const passport = require("passport");
const {
  register,
  login,
  googleSuccess,
} = require("../controllers/authController");

// Normal Auth
router.post("/register", register);
router.post("/login", login);

// Google Auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleSuccess
);

module.exports = router;