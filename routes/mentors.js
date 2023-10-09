const express = require("express");
const router = express.Router();
const {
  createMentor,
  mentorLogin,
  mentorLogout,
  getNewAccessToken,
} = require("../controllers/mentors/mentorsAuth");

const {
  createNewAvailbleSlotForMentor,
  getAllSlotForMentorId,
  fetchSlotDetails,
  deleteSlot,
} = require("../controllers/mentors/slotAvailabilityControllers");
const { mentorAuthMiddleware } = require("../config/passportJWT");
const {
  mentorLoginRules,
  mentorRegistrationRules,
} = require("../validators/mentor");

const {
  updateProfile,
  fetchSubscribedMentees,
} = require("../controllers/mentors/mentorGeneralControllers");

//Mentor Registration
router.route("/register").post(createMentor);
//Mentor Login
router.route("/login").post(mentorLoginRules, mentorLogin);

//Edit Mentor Profile

router.route("/edit-profile/:mentorId").patch(updateProfile);
//Mentor JWT Access Token regeneration
router.post("/regenerate_access_token", getNewAccessToken);

//Mentor LogOut
router.route("/logout").post(mentorAuthMiddleware, mentorLogout);
module.exports = router;

//Time Slots Routes
router
  .route("/available-timeslots/:id")
  .post(createNewAvailbleSlotForMentor)
  .get(getAllSlotForMentorId);

//Fetch Slot Details from Id
router.route("/slot-details/:slotId").get(fetchSlotDetails).delete(deleteSlot);

//Fetcth Subscibed Mentor Profiles
router.get("/subscribed-mentees/:mentorId", fetchSubscribedMentees);
