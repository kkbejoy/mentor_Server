const express = require("express");
const router = express.Router();
const {
  getChatBetweenMentorAndMentee,
  getAllConversationsForAMentee,
  getAllConversationsForAMentor,
  pushNewMessageFromMentee,
  getAllMessages,
  pushNewMessageFromMentor,
} = require("../controllers/chatControllers/chatControllers");
//Open a new chat between Mentor and Mentee Or Respond with exising chat records

//Confused about the new chat creation. Two kinds of users,-who should start first? and how it should be implemented
router.route("/messages").post(getChatBetweenMentorAndMentee);

//Mentee Side
//Feteches all the Conversations for a mentee
router.route("/mentee-messages").post(getAllConversationsForAMentee);

//Route to specific message and sent message
router
  .route("/mentee-messages/:conversationId")
  .post(pushNewMessageFromMentee)
  .get(getAllMessages);

//Mentor Side
//Feteches all the Conversations for a Mentor
router.route("/mentor-messages").post(getAllConversationsForAMentor);

//Route to specific message and sent message
router
  .route("/mentor-messages/:conversationId")
  .post(pushNewMessageFromMentor)
  .get(getAllMessages);

module.exports = router;
