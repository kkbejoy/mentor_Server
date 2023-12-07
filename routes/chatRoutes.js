const express = require("express");
const router = express.Router();
const {
  getChatBetweenMentorAndMentee,
  markConversationAsReadMenteeSide,
  getAllConversationsForAMentee,
  fetchMenteeUnreadConversations,
  fetchMentorUnreadConversations,
  getAllConversationsForAMentor,
  pushNewMessageFromMentee,
  getAllMessages,
  pushNewMessageFromMentor,
  markConversationAsReadMentorSide,
} = require("../controllers/chatControllers/chatControllers");
const checkEnrollmentStatus = require("../middlewares/checkEnrollmentStatus");
const { menteeAuthMiddleware } = require("../config/passportJWT");
const { mentorAuthMiddleware } = require("../config/passportJWT");

//Open a new chat between Mentor and Mentee Or Respond with exising chat records

//Confused about the new chat creation. Two kinds of users,-who should start first? and how it should be implemented
router.route("/messages").post(
  menteeAuthMiddleware,
  // checkEnrollmentStatus,
  getChatBetweenMentorAndMentee
);

//Mentee Side
//Feteches all the Conversations for a mentee
router
  .route("/mentee-messages")
  .post(menteeAuthMiddleware, getAllConversationsForAMentee)
  .get(fetchMenteeUnreadConversations);

//Route to specific message and sent message
router
  .route("/mentee-messages/:conversationId")
  .post(menteeAuthMiddleware, pushNewMessageFromMentee)
  .get(menteeAuthMiddleware, getAllMessages)
  .patch(markConversationAsReadMenteeSide);

//Mentor Side
//Feteches all the Conversations for a Mentor
router
  .route("/mentor-messages")
  .post(mentorAuthMiddleware, getAllConversationsForAMentor)
  .get(fetchMentorUnreadConversations);

//Route to specific message and sent message
router
  .route("/mentor-messages/:conversationId")
  .post(mentorAuthMiddleware, pushNewMessageFromMentor)
  .get(mentorAuthMiddleware, getAllMessages)
  .patch(markConversationAsReadMentorSide);

module.exports = router;
