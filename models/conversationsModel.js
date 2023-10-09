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
    isSubscriptionActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("converstation", conversationsSchema);
