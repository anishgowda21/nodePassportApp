const LocalStatergy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStatergy(
      { usernameField: "email" },
      async (email, password, done) => {
        // Match user

        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Email not registerd" });
          }
          // Match password
          if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
          }
          return done(null, false, { message: "Password Incorrect" });
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
