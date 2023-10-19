require("dotenv").config();
const express = require("express");
const app = express();
const mongoConnect = require("./config/databaseConfig");
const passport = require("passport");
const logger = require("morgan");
const cors = require("cors");
const hbs = require("express-hbs");
const socketModule = require("./socketIo");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("./config/passportLocalConfig");

const menteesRoutes = require("./routes/mentees");
const mentorRoutes = require("./routes/mentors");
const moderatorRoutes = require("./routes/moderators");
const chatRoutes = require("./routes/chatRoutes");
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.engine(
  "hbs",
  hbs.express4({
    partialsDir: __dirname + "/views/partials",
  })
);
app.set("view engine", "hbs");

app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes Mounting
app.use("/api/mentees", menteesRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/moderator", moderatorRoutes);
app.use("/api/chats", chatRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on Port: ${process.env.PORT}`);
});

//Socket IO Configuration
socketModule(server);

// module.exports = server;
// const io = require("socket.io")(server, {
//   pingTimeout: 6000,
//   cors: {
//     origin: process.env.CLIENT_url,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("connected to socket.io");

//   socket.on("setup", (userId) => {
//     socket.join(userId);
//     console.log("Socket User", userId);

//     socket.emit("connected");
//   });

//   socket.on("chat room", (roomId) => {
//     socket.join(roomId);
//     console.log("Chat room creted" + roomId);
//   });
//   socket.on("new message", (newMessage) => {
//     console.log("new Message", newMessage);
//     socket.to(roomId).emit("messageReveived", newMessage);
//   });
// });
