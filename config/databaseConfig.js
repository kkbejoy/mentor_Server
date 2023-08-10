const mongoose = require("mongoose");

const dbName = "MentorDatabase";
const uri = process.env.mongo_URI;

mongoose.connect(uri, {
  dbName,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongoConnect = mongoose.connection;
mongoConnect.on("error", console.error.bind(console, "Connection error:"));

mongoConnect.once("open", function () {
  console.log("Connection to MongoDB established successfully!");
});

module.exports = mongoConnect;
// module.exports = db;
