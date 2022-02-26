const express = require("express");
const router = express.Router();
const { protect } = require("../middleWares/authMiddleware");
router.get("/", (req, res) => res.render("welcome.html"));
router.get("/dashboard", protect, (req, res) =>
  res.render("dashboard.html", { name: req.user.name })
);

module.exports = router;
