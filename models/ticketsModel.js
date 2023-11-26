const { Schema, Types, Model, default: mongoose } = require("mongoose");

const ticketSchema = new Schema(
  {
    complainant: {
      complainantType: {
        type: String,
        enum: ["mentee", "mentor"],
        required: true,
      },
      complainantId: {
        type: Types.ObjectId,
        required: true,
        refPath: "complainant.complainantType",
      },
    },
    accused: {
      accusedType: {
        type: String,
        enum: ["mentee", "mentor"],
        required: true,
      },
      accusedId: {
        type: Types.ObjectId,
        required: true,
        refPath: "accused.accusedType",
      },
    },
    content: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ticket", ticketSchema);
