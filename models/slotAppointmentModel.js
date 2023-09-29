const { Schema, model, Types } = require("mongoose");

const slotAppointmentSchema = new Schema({
  mentorId: {
    type: Types.ObjectId,
    required: true,
  },
  menteeId: {
    type: Types.ObjectId,
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
});

module.exports = model("slotAppointmentModel", slotAppointmentSchema);
