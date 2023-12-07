const notificationSchema = require("../models/notificationModel");

//Add new Notifications
const addNewNotification = async (userId, userType, content, type) => {
  try {
    console.log(userId, userType, content, type);
    const newNotificationObject = new notificationSchema({
      recipient: userId,
      recipientType: userType,
      content: content,
      type: type,
    });
    const responseFromDb = await newNotificationObject.save();
    console.log("Noti", responseFromDb);
    return responseFromDb;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Get all notification for a User

const getAllNotificationForAUser = async (userId) => {
  try {
    const allNotifications = await notificationSchema.find({
      recipient: userId,
    });
    return allNotifications;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const markAllNotificationsForThisMenteeAsRead = async (menteeId) => {
  try {
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
    const responseFromDb = await notificationSchema.updateMany(
      {
        recipient: menteeId,
        createdAt: {
          // $gte: oneMinuteAgo,
          $lt: oneMinuteAgo,
        },
      },
      { isRead: true }
    );
    return responseFromDb;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  addNewNotification,
  getAllNotificationForAUser,
  markAllNotificationsForThisMenteeAsRead,
};
