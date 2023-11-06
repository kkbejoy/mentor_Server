const server = require("./app");

module.exports = (server) => {
  const user = {};
  const rooms = {};
  const io = require("socket.io")(server, {
    pingTimeout: 6000,
    cors: {
      origin: process.env.CLIENT_url,
    },
  });

  io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userId) => {
      socket.join(userId);
      user[socket.id] = userId;
      console.log("Socket User", userId);

      socket.emit("connected");
    });

    socket.on("chat room", (roomId) => {
      socket.join(roomId);
      rooms[socket.id] = roomId;
      console.log("Chat room creted" + rooms);
    });
    socket.on("new message", (newMessage) => {
      console.log("new Message", newMessage);
      const receiver = newMessage?.receiver;
      socket.in(receiver).emit("messageReveived", newMessage);
      // const roomId = newMessage?.conversation;
      // //rooms[socket.id];
      // console.log("Room id", roomId);
      // io.to(roomId).emit("messageReveived", newMessage);
    });

    socket.on("notification", (notification) => {
      // console.log("notification", notification);
      const receiver = notification?.receiver;
      socket.in(receiver).emit("notification", notification);
      // const roomId = newMessage?.conversation;
      // //rooms[socket.id];
      // console.log("Room id", roomId);
      // io.to(roomId).emit("messageReveived", newMessage);
    });

    socket.on("scheduler", (deleteNotification) => {
      console.log("Scheduler", deleteNotification);
      if (deleteNotification.menteeId) {
        console.log("Scheduler Socket", deleteNotification.deleted);
        socket
          .in(deleteNotification.menteeId._id)
          .emit("scheduler", deleteNotification);
      }
      console.log("mentee Id absent");
    });
    socket.on("slotBooked", (slotDetails) => {
      console.log("slotBooked", slotDetails);
      // if (deleteNotification.menteeId) {
      console.log("Slot Booked", slotDetails);
      // socket
      //   .in(s.menteeId._id)
      //   .emit("scheduler", deleteNotification);
      // }
    });
  });
};
