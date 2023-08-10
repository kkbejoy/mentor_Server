const { ExtractJwt, Strategy } = require("passport-jwt");
const menteeSchema = require("../models/mentees");
const mentorSchema = require("../models/mentors");
const moderatorSchema = require("../models/moderator");

const passport = require("passport");
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_SECRET_KEY,
};

const menteeStrategy = new Strategy(options, async (payload, done) => {
  try {
    console.log("payload", payload); // Payload is the decoded user from JWT
    // const date = new Date(payload.exp * 1000);
    // console.log(date);
    const menteeId = payload.id;
    const mentee = await menteeSchema.findById(menteeId);
    if (mentee && !mentee.isBlocked) {
      console.log("Auth passed");
      return done(null, mentee);
    }

    return done(null, false);
  } catch (error) {
    console.log(error);
    return done(error);
  }
});

const mentorStrategy = new Strategy(options, async (payload, done) => {
  try {
    console.log("payload", payload); // Payload is the decoded user from JWT
    // const date = new Date(payload.exp * 1000);
    // console.log(date);
    const mentorId = payload.id;
    const mentor = await mentorSchema.findById(mentorId);
    if (mentor && !mentor.isBlocked && mentor.isApproved) {
      console.log("Auth passed");
      return done(null, mentor);
    }

    return done(null, false);
  } catch (error) {
    console.log(error);
    return done(error);
  }
});

const moderatorStrategy = new Strategy(options, async (payload, done) => {
  try {
    console.log("payload", payload); // Payload is the decoded user from JWT
    // const date = new Date(payload.exp * 1000);
    // console.log(date);
    const moderatorId = payload.id;
    const moderator = await moderatorSchema.findById(moderatorId);
    if (moderator) {
      console.log("Modearator Auth passed");
      return done(null, moderator);
    }

    return done(null, false);
  } catch (error) {
    console.log(error);
    return done(error);
  }
});

passport.use("mentee", menteeStrategy);
passport.use("mentor", mentorStrategy);
passport.use("moderator", moderatorStrategy);

const menteeAuthMiddleware = passport.authenticate("mentee", {
  session: false,
});
const mentorAuthMiddleware = passport.authenticate("mentor", {
  session: false,
});
const modearatorAuthMiddleware = passport.authenticate("moderator", {
  session: false,
});
module.exports = {
  menteeAuthMiddleware,
  mentorAuthMiddleware,
  modearatorAuthMiddleware,
};
