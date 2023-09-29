const passport = require("passport");
const menteeSchema = require("../models/mentees");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callBackurl = process.env.GOOGLE_AUTH_CALLBACK_URL;

const passportGoogleOAuth = new GoogleStrategy(
  {
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: callBackurl,
    scope: ["profile", "email"],
    // authorizationURL: "https://accounts.google.com/o/oauth2/auth",
    // tokenURL: "https://accounts.google.com/o/oauth2/token",
    // clientID: googleClientId,
    // clientSecret: googleClientSecret,
    // callbackURL: callBackurl,
    // passReqToCallback: true, // Pass the request object to the callback
  },
  async function (accessToken, refreshToken, profile, cb) {
    //This function will be excecuted only on successfull authentication
    try {
      console.log("google auth");
      const emailFromGoogle = profile.emails[0].value;
      console.log(emailFromGoogle);

      console.log("User Profile:", accessToken, refreshToken, profile);

      const mentee = await menteeSchema.findOne({ email: emailFromGoogle });
      if (mentee) {
        console.log("mentee already Exists");
        return cb(null, mentee);
      } else {
        // If mentee doesn't exist, create a new document
        console.log("Creating new mentee");
        newNMenteeObject = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: emailFromGoogle,
          phoneNumber: 1234,
          password: 1234,
        };
        // console.log(newNMenteeObject);

        const newMentee = new menteeSchema(newNMenteeObject);
        newMentee
          .save()
          .then((res) => {
            console.log(res);
          })
          .catch((res) => {
            console.log(res);
          });
        return cb(null, newMentee);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

passport.use("oauth2", passportGoogleOAuth);

const passportGoogleAuth = passport.authenticate("oauth2", {
  scope: ["email", "profile"],
});

const passportGoogleAuthCallback = passport.authenticate("oauth2", {
  failureRedirect: "/login",
  session: false,
});
module.exports = {
  passportGoogleAuth,
  passportGoogleAuthCallback,
};
