const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientType",
      required: true,
    },
    recipientType: {
      type: String,
      enum: ["mentee", "mentor"],
    },
    content: {
      type: String,
      required: true, // The notification message or content
    },
    type: {
      type: String, // You can define types like 'message', 'request', 'alert', etc.
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false, // Indicates whether the notification has been read
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("notification", notificationSchema);

module.exports = Notification;
