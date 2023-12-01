const { default: mongoose, Schema, Types, trusted } = require("mongoose");

const messageSchema = new Schema(
  {
    conversation: {
      type: Types.ObjectId,
      ref: "converstation",
      required: true,
    },
    sender: {
      senderType: {
        type: String,
        enum: ["mentee", "mentor"],
        required: true,
      },
      senderId: {
        type: Types.ObjectId,
        required: true,
        refPath: "sender.senderType",
      },
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);
