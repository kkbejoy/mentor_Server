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
} = require("../controllers/mentors/slotAvailabilityControllers");
const { mentorAuthMiddleware } = require("../config/passportJWT");
const {
  mentorLoginRules,
  mentorRegistrationRules,
} = require("../validators/mentor");

//Mentor Registration
router.route("/register").post(createMentor);
//Mentor Login
router.route("/login").post(mentorLoginRules, mentorLogin);

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
