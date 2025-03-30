const dotenv = require('dotenv');
dotenv.config();
const http = require("http");
const app = require("./app.js");
const socketio = require('socket.io');
const express = require("express");
const path = require("path");
import { io } from "socket.io-client";

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    transports: ["websocket"],
  },
});

app.set("view engine", "ejs");

io.on("connection", (socket) => {
    console.log('a user connected');

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on("send_message", (data) => {
        io.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});