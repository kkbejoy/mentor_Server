const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  menteeRegistrationRules,
  menteeLoginRules,
} = require("../validators/mentees");
const {
  createMentee,
  verifyEmailIdFromJWT,
  getMenteeTokens,
  getNewAccessToken,
  menteeLogout,
  googleAuthSuccess,
  getStripePublishableKey,
  getStripePaymentIntent,
  stripeCheckoutSession,
} = require("../controllers/mentees/menteesAuth");

const {
  fetchListOfMentorsSubscribed,
  mentorsTimeSlotAvailabilityList,
  fixMentorTimeSlot,
} = require("../controllers/mentees/menteeAutherisedControllers");
const {
  fetchMentorsSearchResult,
  fetchMentorProfileDetails,
  trail,
} = require("../controllers/mentees/generalControllers");
const { menteeAuthMiddleware } = require("../config/passportJWT");
const {
  passportGoogleAuth,
  passportGoogleAuthCallback,
} = require("../config/passportGoogleOAuth 2.0");

const {
  approveEnrollementFromPaymentSuccess,
} = require("../controllers/mentees/paymentControllers");

//Mentee Registration
router.route("/register").post(menteeRegistrationRules, createMentee);

//Mentee Email Verification
router.get("/verify/:jwt", verifyEmailIdFromJWT);
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

//Search For Mentors
router.get("/mentors/:search", fetchMentorsSearchResult);

//Mentor Profile Data
router.get("/mentor/profile/:id", fetchMentorProfileDetails);

//Stripe Checkout
router.post("/create-checkout", menteeAuthMiddleware, stripeCheckoutSession);

//Payment succss page To Enrollment Aproval
router.post(
  "/enrollment-success",
  menteeAuthMiddleware,
  approveEnrollementFromPaymentSuccess
);

// Fetching List of  subscribed Mentors
router.get(
  "/subscribed-mentors/:menteeId",
  menteeAuthMiddleware,
  fetchListOfMentorsSubscribed
);

// Fetching Details of timeSlots for Mentees //Book Mentor from available Time slots  By Mentee

router
  .route("/timeslots/:menteeId")
  .get(menteeAuthMiddleware, mentorsTimeSlotAvailabilityList)
  .post(menteeAuthMiddleware, fixMentorTimeSlot);

// router.post("/fix-slot", fixMentorTimeSlot);
//Trail route
router.route("/trail").get(trail);
module.exports = router;
