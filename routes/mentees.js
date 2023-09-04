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
  googleAuthSuccess,
} = require("../controllers/mentees/menteesAuth");
const { menteeAuthMiddleware } = require("../config/passportJWT");
const {
  passportGoogleAuth,
  passportGoogleAuthCallback,
} = require("../config/passportGoogleOAuth 2.0");
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

//GOOGLE AUTH
//Google authentication
router.get("/google_auth_mentee", passportGoogleAuth);

//Google authentication Callback
router.get("/googlecallback", passportGoogleAuthCallback, googleAuthSuccess);

// //Google success redirect

// router.get("/google_success", googleAuthSuccess);

module.exports = router;
