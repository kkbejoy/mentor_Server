//Create Message Object
const mongoose = require("mongoose");

const messageModel = require("../models/messageModel");

//Add a  new Message to the database
const createNewMessage = async (
  conversationId,
  content,
  senderType,
  senderId
) => {
  try {
    const messageObject = {
      conversation: conversationId,
      content: content,
      sender: {
        senderType: senderType,
        senderId: senderId,
      },
    };
    const responseFromDb = await messageModel.create(messageObject);
    // console.log("Unpopu/sl;ated response", responseFromDb);
    const populatedResponse = await responseFromDb.populate({
      path: "sender.senderId conversation",
      select:
        "firstName lastName isActive isBlocked participants.mentor participants.mentee ",
    });
    // .populate("conversation");
    return populatedResponse;
  } catch (error) {
    throw error;
  }
};

//Fetch all messages inside a conversation
const getAllMessagesInAConversation = async (conversationId) => {
  try {
    if (!conversationId) throw new Error("Empty conversation id");
    const allMessages = await messageModel
      .find(
        {
          conversation: conversationId,
        },
        { content: 1, createdAt: 1, sender: 1 }
      )
      .populate({
        path: "sender.senderId",
        select: "firstName lastName isActive isBlocked ",
      });
    // console.log("message", allMessages);
    return allMessages;
  } catch (error) {
    throw error;
  }
};

//REtruns the unread conversation id as an array
const getTheNumberOfUnreadConversationsForMentee = async (
  menteeId,
  conversationIdArray
) => {
  try {
    // senderId;
    const unreadMessages = await messageModel.aggregate([
      {
        $match: {
          conversation: { $in: conversationIdArray },
          "sender.senderType": "mentor",
          "sender.senderId": { $ne: new mongoose.Types.ObjectId(menteeId) },
          isRead: false,
        },
      },
      {
        $group: {
          _id: "$conversation",
          // messages: { $push: "$$ROOT" },
        },
      },
    ]);
    // console.log("Unread Messages Count", unreadMessages);
    return unreadMessages;
  } catch (error) {
    throw error;
  }
};

// Gets an Array of Conversation Ids with unread Messages
const getTheNumberOfUnreadConversationsForMentor = async (
  mentorId,
  conversationIdArray
) => {
  try {
    // senderId;
    const unreadMessages = await messageModel.aggregate([
      {
        $match: {
          conversation: { $in: conversationIdArray },
          "sender.senderType": "mentee",
          "sender.senderId": { $ne: new mongoose.Types.ObjectId(mentorId) },
          isRead: false,
        },
      },
      {
        $group: {
          _id: "$conversation",
          // messages: { $push: "$$ROOT" },
        },
      },
    ]);
    // console.log("Unread Messages Count", unreadMessages);
    return unreadMessages;
  } catch (error) {
    throw error;
  }
};

// const unreadMessagesMenteeSide = async (menteeId) => {
//   try {
//     const unreadMessages = await messageModel.find({
//       "sender.senderId": menteeId,
//       isRead: false,
//     });
//     console.log("Unread Messages Count", unreadMessages);
//     return unreadMessages;
//   } catch (error) {
//     throw error;
//   }
// };

//Mark  all messages as read From Mentee side

const markMenteeSideMessagesAsRead = async (menteeId, conversationId) => {
  try {
    console.log(menteeId, conversationId);
    const responseFromApi = await messageModel.updateMany(
      {
        conversation: conversationId,
        isRead: false,
        "sender.senderType": "mentor",
        // "sender.senderId": { $ne: menteeId },
      },
      { isRead: true }
    );

    return responseFromApi;
  } catch (error) {
    throw error;
  }
};

const markMentorSideMessagesAsRead = async (mentorId, conversationId) => {
  try {
    const responseFromApi = await messageModel.updateMany(
      {
        conversation: conversationId,
        isRead: false,
        "sender.senderType": "mentee",
        // "sender.senderId": { $ne: menteeId },
      },
      { isRead: true }
    );
    return responseFromApi;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createNewMessage,
  getAllMessagesInAConversation,
  getTheNumberOfUnreadConversationsForMentee,
  getTheNumberOfUnreadConversationsForMentor,
  // unreadMessagesMenteeSide,
  markMenteeSideMessagesAsRead,
  markMentorSideMessagesAsRead,
};
