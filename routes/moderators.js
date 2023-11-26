const express = require("express");
const router = express.Router();
const {
  moderatorLogin,
  getNewAccessToken,
  getAllMentees,
  getAllMentors,
  getAllMentorRequests,
  modifyMentorRequest,
  blockOrUnBlockMentor,
  blockOrUnBlockMentees,
  moderatorLogout,
  fetchAllTickets,
  takeActionAgainstAccused,
  fetchDailyEnrollmentData,
  fetchDailyNewMenteeData,
} = require("../controllers/moderators/moderators");
const { moderatorLoginRules } = require("../validators/moderator");
const { modearatorAuthMiddleware } = require("../config/passportJWT");

//Moderator Login
router.route("/login").post(moderatorLoginRules, moderatorLogin);

//Moderator Regenerate Access Token

router.route("/regenerate_access_token").post(getNewAccessToken);

//Moderator LogOut
router.route("/logout").post(modearatorAuthMiddleware, moderatorLogout);

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

//Tickets

router.route("/tickets").get(fetchAllTickets).patch(takeActionAgainstAccused);

//Data For Daily Enrollment Graph
router.get("/daily-enrollments", fetchDailyEnrollmentData);

//Data New mentees details for Home page
router.get("/daily-new-mentees", fetchDailyNewMenteeData);
