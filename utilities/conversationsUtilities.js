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
const createConversationBetweenMentorAndMentee = async (mentorId, menteeId) => {
  try {
    const responseFromNewConversationCreate = await conversationsModel.create({
      participants: { mentor: mentorId, mentee: menteeId },
    });
    return responseFromNewConversationCreate;
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
          "firstName lastName profileImageUrl content createdAt updatedAt latestMessage.updatedAt",
      });
    const sortedRespose = response.sort((a, b) => {
      const c = new Date(a.latestMessage.updatedAt);
      const d = new Date(b.latestMessage.updatedAt);
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
          "firstName lastName content createdAt profileImageUrl updatedAt latestMessage.updatedAt",
      });
    // .sort({ updatedAt: -1 });
    const sortedRespose = response.sort((a, b) => {
      const c = new Date(a.latestMessage.updatedAt);
      const d = new Date(b.latestMessage.updatedAt);
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

//Mark a conversation as Read

const markAConversationAsRead = async (conversationId) => {
  try {
    const responseFromDb = await conversationsModel.findByIdAndUpdate(
      conversationId,
      {
        isRead: true,
      }
    );
    return responseFromDb;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  searchConversations,
  createConversationBetweenMentorAndMentee,
  fetchMenteeConversations,
  fetchMentorConversations,
  addlatestMessageToConversation,
  markAConversationAsRead,
};
