const { Schema, model, Types } = require("mongoose");
const TokenSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      // ref: "mentee",
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiration: {
      type: Date,
      required: true,
      expires: 0, // Set the expiration time for documents
    },
  },
  { timestamps: true }
);

module.exports = model("Token", TokenSchema);
