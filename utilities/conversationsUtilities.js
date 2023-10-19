const conversationsModel = require("../models/conversationsModel");

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
        path: "participants.mentor",
        select: "firstName lastName profileImageUrl",
      });
    return response;
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
      .populate({ path: "participants.mentee", select: "firstName lastName " });
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createConversationBetweenMentorAndMentee,
  fetchMenteeConversations,
  fetchMentorConversations,
};
