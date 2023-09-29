const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Mentee = require("../models/mentees");
const bcrypt = require("bcrypt");

try {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          console.log(username, password);
          const mentee = await Mentee.findOne({
            email: username,
            isBlocked: false,
          });
          console.log("mentee", mentee);
          if (!mentee) {
            console.log("auth failed");
            return done(null, false, { message: "User not found" });
          }
          const passwordsMatch = await bcrypt.compare(
            password,
            mentee.password
          );
          console.log("passwordsMatch", passwordsMatch);

          if (!passwordsMatch) {
            console.log("password failed");
            return done(null, false, { message: "Incorrect password" });
          }

          return done(null, mentee);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  //   passport.serializeUser((user, done) => {
  //     done(null, user.id);
  //   });

  //   passport.deserializeUser(async (id, done) => {
  //     try {
  //       const mentee = await Mentee.findById(id);
  //       done(null, mentee);
  //     } catch (err) {
  //       done(err);
  //     }
  //   });
} catch (err) {
  // Handle any error that occurs during passport configuration
  console.error("Passport configuration error:", err);
}
