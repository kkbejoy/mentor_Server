const { Schema, model, Types } = require("mongoose");

const slotAppointmentSchema = new Schema(
  {
    mentorId: {
      type: Types.ObjectId,
      ref: "mentor",
      required: true,
    },
    menteeId: {
      type: Types.ObjectId,
      ref: "mentee",
      required: false,
    },
    type: {
      type: String,
      enum: ["available", "booked", "completed"],
      default: "available",
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    mentorPreferences: {
      type: String,
    },
    menteeQueryTitle: {
      type: String,
    },
    menteeQueryDescription: {
      type: String,
    },
    mentorPrefferedMode: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("slotAppointmentModel", slotAppointmentSchema);
