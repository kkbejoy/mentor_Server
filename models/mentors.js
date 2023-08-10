const { Schema, model, Types } = require("mongoose");

const mentorSchema = new Schema(
  {
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
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    firmName: {
      type: String,
    },
    location: {
      type: String,
    },
    bio: {
      type: String,
    },
    educationalQualification: {
      type: Array,
      default: [],
    },
    hourlyRate: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    serviceCategories: {
      type: Array,
      default: [],
    },
    expertise: {
      type: Array,
      default: [],
    },
    subscriptionTypes: {
      type: Array,
      default: [],
    },
    commitments: {
      type: Array,
      default: [],
    },
    reviews: {
      type: Array,
      default: [],
    },
    website: {
      type: String,
    },
    twitterUrl: {
      type: String,
    },
    linkedInUrl: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = model("mentor", mentorSchema);
