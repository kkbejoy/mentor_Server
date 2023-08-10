const express = require("express");
const router = express.Router();
const {
  moderatorLogin,
  getAllMentees,
  getAllMentors,
  getAllMentorRequests,
  modifyMentorRequest,
  blockOrUnBlockMentor,
  blockOrUnBlockMentees,
} = require("../controllers/moderators/moderators");
const { moderatorLoginRules } = require("../validators/moderator");
const { modearatorAuthMiddleware } = require("../config/passportJWT");

//Moderator Login
router.route("/login").post(moderatorLoginRules, moderatorLogin);

// Get mentees data
router.route("/mentees").get(modearatorAuthMiddleware, getAllMentees);

// Get Mentors data
router.route("/mentors").get(modearatorAuthMiddleware, getAllMentors);

//Get all New Mentor requests
router
  .route("/mentor_requests")
  .get(modearatorAuthMiddleware, getAllMentorRequests);

//Approving the Mentor Requests

router.patch(
  "/mentor_request_accept",
  modearatorAuthMiddleware,
  modifyMentorRequest
);

//Block Or Unblock Mentor

router.patch(
  "/mentor_status_change",
  modearatorAuthMiddleware,
  blockOrUnBlockMentor
);

//Block Or Unblock Mentee

router.patch(
  "/mentees_status_change",
  modearatorAuthMiddleware,
  blockOrUnBlockMentees
);
module.exports = router;
