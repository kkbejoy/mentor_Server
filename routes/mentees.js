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
  getAllNotifications,
  updateProfile,
  fetchBookedTimeSlots,
  revokeABooking,
  fetchMenteeProfileDetails,
  raiseATicketFromMenteeSide,
  getTheListOfTicketsRaisedByAMentee,
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

// const { raiseATicket } = require("../utilities/ticketUtilities");
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
router.get("/mentors", fetchMentorsSearchResult);

//Mentor Profile Data
router.get(
  "/mentor/profile/:id",
  // menteeAuthMiddleware,
  fetchMentorProfileDetails
);

//Edit Mentee Profile
router
  .route("/edit-profile/:menteeId")
  .get(fetchMenteeProfileDetails)
  .patch(updateProfile);

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
//Notifications
router.route("/notifications/:menteeId").get(getAllNotifications);
// Fetching Details of timeSlots for Mentees //Book Mentor from available Time slots  By Mentee
router
  .route("/timeslots/:menteeId")
  .get(menteeAuthMiddleware, mentorsTimeSlotAvailabilityList)
  .post(menteeAuthMiddleware, fixMentorTimeSlot);

//Fetch Booked time slots By a Mentee

router
  .route("/booked-slots/:menteeId")
  .get(fetchBookedTimeSlots)
  .patch(revokeABooking);

//Raise  a Ticket
router
  .route("/raise-ticket/:menteeId")
  .post(raiseATicketFromMenteeSide)
  .get(getTheListOfTicketsRaisedByAMentee);
//Trail route
router.route("/trail").get(trail);
module.exports = router;
