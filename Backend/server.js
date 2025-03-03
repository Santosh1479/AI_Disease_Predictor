const dotenv = require('dotenv');
dotenv.config();
const http = require("http");
const app = require("./app.js");
const socketio = require('socket.io');
const express = require("express");
const path = require("path");

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("sendLocation", (data) => {
    console.log("Location received:", data);
    io.emit("receiveLocation", { id: socket.id, ...data });
  });
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});