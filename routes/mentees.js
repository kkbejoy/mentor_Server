const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  menteeRegistrationRules,
  menteeLoginRules,
} = require("../validators/mentees");
const {
  createMentee,
  getMenteeTokens,
  getNewAccessToken,
  menteeLogout,
} = require("../controllers/mentees/menteesAuth");
const { menteeAuthMiddleware } = require("../config/passportJWT");

//Mentee Registration
router.route("/register").post(menteeRegistrationRules, createMentee);

//Mentee Login
router
  .route("/login")
  .post(
    menteeLoginRules,
    passport.authenticate("local", { session: false }),
    getMenteeTokens
  );

//Regenerate Access Token
router.post("/regenerate_access_token", getNewAccessToken);
//Mentee LogOut
router.route("/logout").post(menteeAuthMiddleware, menteeLogout);

module.exports = router;
