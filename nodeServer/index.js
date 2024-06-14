const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  // any new user connecte then other user connected to know that
  socket.on("new-user-joined", (name) => {
    // console.log("New user joined: ", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  //if someone sends new message, broadcast it to other user 
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  //if someone leav the chat, let others know
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(8000, () => {
  console.log("Server is running on port 8000");
});
