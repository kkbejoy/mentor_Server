const express = require("express");
const router = express.Router();
const {
  getChatBetweenMentorAndMentee,
  markConversationAsRead,
  getAllConversationsForAMentee,
  getAllConversationsForAMentor,
  pushNewMessageFromMentee,
  getAllMessages,
  pushNewMessageFromMentor,
} = require("../controllers/chatControllers/chatControllers");
const checkEnrollmentStatus = require("../middlewares/checkEnrollmentStatus");
const { menteeAuthMiddleware } = require("../config/passportJWT");
const { mentorAuthMiddleware } = require("../config/passportJWT");

//Open a new chat between Mentor and Mentee Or Respond with exising chat records

//Confused about the new chat creation. Two kinds of users,-who should start first? and how it should be implemented
router
  .route("/messages")
  .post(
    menteeAuthMiddleware,
    // checkEnrollmentStatus,
    getChatBetweenMentorAndMentee
  )
  .patch(markConversationAsRead);

//Mentee Side
//Feteches all the Conversations for a mentee
router
  .route("/mentee-messages")
  .post(menteeAuthMiddleware, getAllConversationsForAMentee);

//Route to specific message and sent message
router
  .route("/mentee-messages/:conversationId")
  .post(menteeAuthMiddleware, pushNewMessageFromMentee)
  .get(menteeAuthMiddleware, getAllMessages);

//Mentor Side
//Feteches all the Conversations for a Mentor
router
  .route("/mentor-messages")
  .post(mentorAuthMiddleware, getAllConversationsForAMentor);

//Route to specific message and sent message
router
  .route("/mentor-messages/:conversationId")
  .post(mentorAuthMiddleware, pushNewMessageFromMentor)
  .get(mentorAuthMiddleware, getAllMessages);

module.exports = router;
