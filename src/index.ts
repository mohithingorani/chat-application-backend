// Import required modules
require("dotenv").config()
import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
// Create an Express application
const app = express();
const server = http.createServer(app);

// Create a new instance of Socket.IO and pass the server instance
const io = new SocketIOServer(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Socket.IO event listeners
io.on("connection", (socket: Socket) => {
    console.log("User connected");

    socket.on("message", (message: string, roomName: string, id: string, currentTime: string, usernname: string) => {
        io.to(roomName).emit("message", message, id, currentTime,usernname);
    });

    socket.on("joinRoom", (roomName: string) => {
        console.log("Joining room: " + roomName);
        socket.join(roomName);
    });

    socket.on("enter",(roomName:string, userName:string)=>{
        console.log( userName +" entered room: " + roomName);
        io.to(roomName).emit("enter",userName);
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Start the server
const PORT: number = parseInt(process.env.PORT || "3000");
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
