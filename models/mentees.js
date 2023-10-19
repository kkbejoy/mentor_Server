const { Schema, model, Types } = require("mongoose");

const menteeSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  enrollments: {
    type: Types.ObjectId,
    ref: "enrollments",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  address: {
    type: Types.ObjectId,
    ref: "address",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  stripeId: {
    type: String,
  },
  profilePicUrl: {
    type: String,
  },

  // refreshTokens: {
  //   type: Array,
  //   default: [],
  // },
});

module.exports = model("mentee", menteeSchema);
