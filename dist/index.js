"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import required modules
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
// Create an Express application
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Create a new instance of Socket.IO and pass the server instance
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});
// Socket.IO event listeners
io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("message", (message, roomName, id, currentTime, usernname) => {
        io.to(roomName).emit("message", message, id, currentTime, usernname);
    });
    socket.on("joinRoom", (roomName) => {
        console.log("Joining room: " + roomName);
        socket.join(roomName);
    });
    socket.on("enter", (roomName, userName) => {
        console.log(userName + " entered room: " + roomName);
        io.to(roomName).emit("enter", userName);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
// Start the server
const PORT = parseInt(process.env.PORT || "3000");
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
