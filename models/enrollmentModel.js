const { Schema, model, Types } = require("mongoose");
const enrollmentSchema = new Schema(
  {
    menteeId: {
      type: Types.ObjectId,
      ref: "mentee",
    },
    mentorId: {
      type: Types.ObjectId,
      ref: "mentor",
    },
    expiresOn: {
      type: Date,
      default: Date.now(),
    },
    subscriptionId: {
      type: String,
    },
    checkoutId: {
      type: String,
    },
    isEnrollmentActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("enrollment", enrollmentSchema);
