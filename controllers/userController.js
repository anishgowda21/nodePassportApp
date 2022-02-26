const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const registerUser = async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill all the fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be more then 6 charecters" });
  }

  if (errors.length > 0) {
    return res.render("register.html", {
      errors,
      name,
      email,
      password,
      password2,
    });
  }
  // Validating user email
  try {
    var user = await User.findOne({ email });
    if (user) {
      errors.push({ msg: "Email present" });
      return res.render("register.html", {
        errors,
        name,
        email,
        password,
        password2,
      });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    req.flash("success_msg", "now registred");
    res.redirect("/users/login");
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
};

const logoutUser = async (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
