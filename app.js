const express = require("express");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv").config();
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const connectDB = require("./config/db");
const passport = require("passport");
connectDB();

// Passport config
require("./config/passport")(passport);

// Body parser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: "super secure password",
    resave: true,
    saveUninitialized: true,
  })
);

// connect-flash
app.use(flash());

//nunjucks
app.engine("views", nunjucks.render);
app.set("view engine", "html");
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

//Passport init
app.use(passport.authenticate("session"));

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users/", require("./routes/users"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`server started on port ${PORT}`));
