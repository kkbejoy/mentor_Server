const server = require("./app");

module.exports = (server) => {
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
      const roomId = newMessage?.conversation;
      //rooms[socket.id];
      console.log("Room id", roomId);
      io.to(roomId).emit("messageReveived", newMessage);
    });
  });
};
