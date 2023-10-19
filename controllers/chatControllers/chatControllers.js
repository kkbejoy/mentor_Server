const {
  createConversationBetweenMentorAndMentee,
  searchConversations,
  fetchMenteeConversations,
  fetchMentorConversations,
} = require("../../utilities/conversationsUtilities");
const {
  createNewMessage,
  getAllMessagesInAConversation,
} = require("../../utilities/messageUtilities");

//might become useless. Make sure to include the new chat creation somewhere else in that case
const getChatBetweenMentorAndMentee = async (req, res) => {
  try {
    const { mentorId, menteeId } = req.body;
    const existingCoversation = await searchConversations(mentorId, menteeId);

    console.log(
      "Existing coversation",
      existingCoversation,
      mentorId,
      menteeId
    );
    if (!existingCoversation) {
      const responseFromCreation =
        await createConversationBetweenMentorAndMentee(mentorId, menteeId);
      console.log("response form already", responseFromCreation);
      res.status(201).json({ status: true, messages: responseFromCreation });
    }
    res.status(200).json({ status: true, messages: existingCoversation });
  } catch (error) {
    console.log(error);
  }
};

//This also will become useless
//Get all conversations for a mentee

const getAllConversationsForAMentee = async (req, res) => {
  try {
    const { menteeId } = req.body;
    const menteeConversations = await fetchMenteeConversations(menteeId);
    // console.log("All conversations for a mentee", menteeConversations);
    res.status(200).json({ status: true, conversations: menteeConversations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error });
  }
};

const getAllConversationsForAMentor = async (req, res) => {
  try {
    const { mentorId } = req.body;
    const mentorConversations = await fetchMentorConversations(mentorId);
    // console.log(
    //   "All conversations for a mentor",
    //   mentorConversations,
    //   mentorId
    // );
    res.status(200).json({ status: true, conversations: mentorConversations });
  } catch (error) {
    console.group(error);
    res.status(500).json({ status: false, error });
  }
};

//Sent a  new Message From mentee side
const pushNewMessageFromMentee = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message, sender } = req.body;

    const senderType = "mentee";
    console.log(conversationId, message, senderType, sender);
    const responseFromMessageCreation = await createNewMessage(
      conversationId,
      message,
      senderType,
      sender
    );
    console.log("New message cretion response", responseFromMessageCreation);
    res.status(201).json({ status: true, responseFromMessageCreation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error });
  }
};

//Sent  a new message from Mentor side

const pushNewMessageFromMentor = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message, sender } = req.body;
    const senderType = "mentor";
    console.log(conversationId, message, senderType, sender);
    const responseFromMessageCreation = await createNewMessage(
      conversationId,
      message,
      senderType,
      sender
    );
    console.log("New message cretion response", responseFromMessageCreation);
    res.status(201).json({ status: true, responseFromMessageCreation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error });
  }
};
//Get all messaages
const getAllMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await getAllMessagesInAConversation(conversationId);
    // console.log("Messages in conversation", messages);
    res.status(200).json({ status: true, messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error });
  }
};
module.exports = {
  getChatBetweenMentorAndMentee,
  getAllConversationsForAMentee,
  getAllConversationsForAMentor,
  pushNewMessageFromMentee,
  pushNewMessageFromMentor,
  getAllMessages,
};
