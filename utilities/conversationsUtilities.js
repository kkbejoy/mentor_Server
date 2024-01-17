const conversationsModel = require("../models/conversationsModel");

//Search Existing  conversation between a Mentor Id and Mentee Id
const searchConversations = async (mentorId, menteeId) => {
  try {
    const convesation = await conversationsModel.findOne({
      participants: {
        $elemMatch: {
          mentor: mentorId,
          mentee: menteeId,
        },
      },
    });
    return convesation;
  } catch (error) {
    throw error;
  }
};
//Creating a new Conversation // SOme issues
const createConversationBetweenMentorAndMentee = async (
  mentorId,
  menteeId,
  enrollmentId
) => {
  try {
    const responseFromNewConversationCreate = await conversationsModel.create({
      participants: {
        mentor: mentorId,
        mentee: menteeId,
        enrollmentId: enrollmentId,
      },
    });
    return responseFromNewConversationCreate;
  } catch (error) {
    throw error;
  }
};

//Returns the conversation details from the Conversation id
const conversationFromId = async (conversationId) => {
  try {
    const conversationDetails = await conversationsModel.findById(
      conversationId
    );
    console.log("Conversation Detaisl from Id:", conversationDetails);
    return conversationDetails;
  } catch (error) {
    throw error;
  }
};

//Mentee SIDe

// Fetch all conversations with mentee ID or do Search in that
const fetchMenteeConversations = async (menteeId) => {
  try {
    const response = await conversationsModel
      .find({
        participants: { $elemMatch: { mentee: menteeId } },
      })
      .populate({
        path: "participants.mentor latestMessage",
        select:
          "firstName lastName profileImageUrl content createdAt updatedAt latestMessage.updatedAt isRead   sender.senderType",
      });
    const sortedRespose = response.sort((a, b) => {
      const c = new Date(a.latestMessage?.updatedAt);
      const d = new Date(b.latestMessage?.updatedAt);
      return d.getTime() - c.getTime();
    });
    return sortedRespose;
  } catch (error) {
    throw error;
  }
};

//Mentor Side
// Fetch all conversations with mentee ID or do Search in that
const fetchMentorConversations = async (mentorId) => {
  try {
    const response = await conversationsModel
      .find({
        participants: { $elemMatch: { mentor: mentorId } },
      })
      .populate({
        path: "participants.mentee latestMessage",
        select:
          "firstName lastName content createdAt profileImageUrl updatedAt latestMessage.updatedAt isRead sender.senderType",
      });
    // .sort({ updatedAt: -1 });
    const sortedRespose = response.sort((a, b) => {
      const c = new Date(a.latestMessage?.updatedAt);
      const d = new Date(b.latestMessage?.updatedAt);
      return d.getTime() - c.getTime();
    });
    return sortedRespose;
  } catch (error) {
    throw error;
  }
};

//Add lastest message to the conversation;

const addlatestMessageToConversation = async (message, conversationId) => {
  try {
    const responseFromDB = await conversationsModel.findByIdAndUpdate(
      { _id: conversationId },
      {
        latestMessage: message,
      }
    );
    return responseFromDB;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Returns Array Of conversationId for a Mentee Id

const fetcthAllConversationIdInsideAnArrayForThisMenteeId = async (
  menteeId
) => {
  try {
    const conversations = await conversationsModel.find({
      participants: { $elemMatch: { mentee: menteeId } },
    });

    const conversationsArray = conversations?.map(
      (conversation) => conversation._id
    );
    return conversationsArray;
  } catch (error) {
    throw error;
  }
};

//Returns Array Of conversationId for a Mentor Id

const fetcthAllConversationIdInsideAnArrayForThisMentorId = async (
  mentorId
) => {
  try {
    const conversations = await conversationsModel.find({
      participants: { $elemMatch: { mentor: mentorId } },
    });

    const conversationsArray = conversations?.map(
      (conversation) => conversation._id
    );
    return conversationsArray;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  searchConversations,
  createConversationBetweenMentorAndMentee,
  conversationFromId,

  fetchMenteeConversations,
  fetchMentorConversations,
  addlatestMessageToConversation,
  fetcthAllConversationIdInsideAnArrayForThisMenteeId,
  fetcthAllConversationIdInsideAnArrayForThisMentorId,
};
