const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
router.get("/login", (req, res) => res.render("login.html"));

router.post("/login", loginUser);

router.get("/register", (req, res) => res.render("register.html"));

router.post("/register", registerUser);

router.post("/logout", logoutUser);

module.exports = router;
