const { model, Schema, default: mongoose, Types } = require("mongoose");

const conversationsSchema = new Schema(
  {
    participants: [
      {
        mentor: {
          type: Types.ObjectId,
          ref: "mentor",
        },
        mentee: {
          type: Types.ObjectId,
          ref: "mentee",
        },
      },
    ],
    latestMessage: { type: Types.ObjectId, ref: "message" },
    isRead: {
      type: Boolean,
      default: false,
    },
    isSubscriptionActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//Correct the spelling of Conversations

module.exports = mongoose.model("converstation", conversationsSchema);
