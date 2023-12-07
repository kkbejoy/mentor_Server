const {
  createConversationBetweenMentorAndMentee,
  searchConversations,
  fetchMenteeConversations,
  fetchMentorConversations,
  addlatestMessageToConversation,
  fetcthAllConversationIdInsideAnArrayForThisMenteeId,
  fetcthAllConversationIdInsideAnArrayForThisMentorId,
  conversationFromId,
} = require("../../utilities/conversationsUtilities");
const {
  createNewMessage,
  getAllMessagesInAConversation,
  getTheNumberOfUnreadConversationsForMentee,
  getTheNumberOfUnreadConversationsForMentor,
  unreadMessagesMenteeSide,
  markMenteeSideMessagesAsRead,
  markMentorSideMessagesAsRead,
} = require("../../utilities/messageUtilities");

const {
  fetchEnrollment,
  isEnrollmentActive,
} = require("../../utilities/enrollmentUtilities");
const {
  fetchSlotDetailsWithId,
  checkLiveSlotCredentials,
} = require("../../utilities/slotAppointmentUtilities");
const { default: mongoose } = require("mongoose");
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
      const enrollmentDetails = await fetchEnrollment(mentorId, menteeId);
      const responseFromCreation =
        await createConversationBetweenMentorAndMentee(
          mentorId,
          menteeId,
          enrollmentDetails?._id
        );
      console.log("response form already", responseFromCreation);
      return res
        .status(201)
        .json({ status: true, conversations: responseFromCreation });
    }
    res.status(200).json({ status: true, conversations: existingCoversation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error });
  }
};

//Mark All COnverstation as read From Mentee SIde
const markConversationAsReadMenteeSide = async (req, res) => {
  try {
    const { conversationId } = req.params;
    console.log("Conversation id", conversationId);
    const responseFromDb = await markMenteeSideMessagesAsRead(
      "menteeId",
      conversationId
    );
    // console.log("Res", responseFromDb);
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};

//Mark Mentor Side Messages as Read
const markConversationAsReadMentorSide = async (req, res) => {
  try {
    const { conversationId } = req.params;
    console.log("Conversation id", conversationId);
    const responseFromDb = await markMentorSideMessagesAsRead(
      "mentorId",
      conversationId
    );
    console.log("Mentor Side Mark as Read Res", responseFromDb);
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};
//Get all conversations for a mentee

const getAllConversationsForAMentee = async (req, res) => {
  try {
    const { menteeId } = req.body;
    const mentorName = req.query.mentorName;
    console.log("Mentor Namen:", mentorName);

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
    // const mentorName = req.query.mentorName;
    // console.log("Mentor Namen:", mentorName, mentorId);
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
    const conversationDetails = await conversationFromId(conversationId);
    const menteeId = conversationDetails?.participants[0]?.mentee;
    const mentorId = conversationDetails?.participants[0]?.mentor;

    const isEnrollmentActiveOrNOt = await isEnrollmentActive(
      mentorId,
      menteeId
    );
    console.log("Enrollment Active or Not", isEnrollmentActiveOrNOt);
    if (!isEnrollmentActiveOrNOt) throw new Error("Enrollment Expired");
    const senderType = "mentee";
    // console.log(conversationId, message, senderType, sender);
    const responseFromMessageCreation = await createNewMessage(
      conversationId,
      message,
      senderType,
      sender
    );

    const responseFromLatestMessagrUpdation =
      await addlatestMessageToConversation(
        responseFromMessageCreation._id,
        conversationId
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
    const conversationDetails = await conversationFromId(conversationId);
    const menteeId = conversationDetails?.participants[0]?.mentee;
    const mentorId = conversationDetails?.participants[0]?.mentor;

    const isEnrollmentActiveOrNOt = await isEnrollmentActive(
      mentorId,
      menteeId
    );
    console.log("Enrollment Active or Not", isEnrollmentActiveOrNOt);
    if (!isEnrollmentActiveOrNOt) throw new Error("Enrollment Expired");

    const senderType = "mentor";
    // console.log(conversationId, message, senderType, sender);
    const responseFromMessageCreation = await createNewMessage(
      conversationId,
      message,
      senderType,
      sender
    );
    const responseFromLatestMessagrUpdation =
      await addlatestMessageToConversation(
        responseFromMessageCreation._id,
        conversationId
      );
    // console.log(
    //   "New message cretion response",
    //   responseFromLatestMessagrUpdation
    // );
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
    console.log("COnversation id from Menro sde conversantoin", conversationId);
    if (!conversationId || conversationId == undefined) {
      throw new Error("No conversationId");
    }
    const messages = await getAllMessagesInAConversation(conversationId);
    // console.log("Messages in conversation", messages);
    res.status(200).json({ status: true, messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};

const fetchMenteeUnreadConversations = async (req, res) => {
  try {
    const { menteeId } = req.query;
    console.log("userId", menteeId);

    const conversationIdArray =
      await fetcthAllConversationIdInsideAnArrayForThisMenteeId(menteeId);

    // console.log("Conversation Array", conversationIdArray);
    const numberOfUnreadConversations =
      await getTheNumberOfUnreadConversationsForMentee(
        menteeId,
        conversationIdArray
      );
    console.log("Count", numberOfUnreadConversations);
    res.status(200).json({
      status: true,
      unreadConversations: numberOfUnreadConversations.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error });
  }
};

// To ge the number of Unread Messsages for a Perticular Mentor
const fetchMentorUnreadConversations = async (req, res) => {
  try {
    const { mentorId } = req.query;
    console.log("userId", mentorId);

    const conversationIdArray =
      await fetcthAllConversationIdInsideAnArrayForThisMentorId(mentorId);

    // console.log("Conversation Array", conversationIdArray);
    const numberOfUnreadConversations =
      await getTheNumberOfUnreadConversationsForMentor(
        mentorId,
        conversationIdArray
      );
    console.log("Count", numberOfUnreadConversations);
    res.status(200).json({
      status: true,
      unreadConversations: numberOfUnreadConversations.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error });
  }
};

//Verify the slot Credentials
const verifyVideoCallSlot = async (req, res) => {
  try {
    const { slotId, userId } = req.body;
    // const slotDetails = await fetchSlotDetailsWithId(slotId);
    console.log("Slot Details:", slotId, userId);
    const slotDetails = await checkLiveSlotCredentials(slotId, userId);
    if (!slotDetails) throw new Error("No such Slot exists");
    console.log("Slot Details:", slotDetails, userId);
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error });
  }
};
module.exports = {
  getChatBetweenMentorAndMentee,
  markConversationAsReadMenteeSide,
  getAllConversationsForAMentee,
  getAllConversationsForAMentor,
  pushNewMessageFromMentee,
  pushNewMessageFromMentor,
  markConversationAsReadMentorSide,
  getAllMessages,
  fetchMenteeUnreadConversations,
  fetchMentorUnreadConversations,
  verifyVideoCallSlot,
};
