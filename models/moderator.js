const { Schema, Types, model } = require("mongoose");

const moderatorSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// const BejoyKK = {
//   name: "Bejoy K K",
//   email: "kkbejoy@gmail.com",
//   password: "123",
// };

module.exports = model("moderator", moderatorSchema);

// const bejoy = new moderator(BejoyKK);
// bejoy
//   .save()
//   .then((res) => console.log("saved", res))
//   .catch((error) => {
//     console.log(error);
//   });
