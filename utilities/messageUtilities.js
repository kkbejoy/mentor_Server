//Create Message Object

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
module.exports = {
  createNewMessage,
  getAllMessagesInAConversation,
};
