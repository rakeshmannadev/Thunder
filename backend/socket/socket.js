import { Server } from "socket.io";
import express from "express";
import http from "http";
import Room from "../models/Room.js";
import User from "../models/User.js";
const app = express();

const server = http.createServer(app);
const CLIENT_URL = process.env.CLIENT_URL;

const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL],
    methods: ["GET", "POST"],
  },
});

const activeUsers = {}; // tracks active users by roomid
const adminSockets = {}; // tracks admin socket ids by roomid

io.on("connection", (socket) => {
  const { userId, roomId } = socket.handshake.query;

  // Add user to the active user list
  if (!activeUsers[roomId]) activeUsers[roomId] = [];
  activeUsers[roomId].push({ userId, socketId: socket.id });

  // Notify room of new user connection
  io.to(roomId).emit("updateUsers", {
    users: activeUsers[roomId],
  });

  // Initialize broadcast
  socket.on("initializeBroadcast", async () => {
    const room = await Room.findOne({ roomId });
    if (!room) return;

    if (room.admin.toString() !== userId.toString()) return;

    const user = await User.findById(userId);
    if (!user) return;

    // Store the admin's socket ID for tracking
    adminSockets[roomId] = socket.id;
    socket.join(roomId); // Admin joins the room
    socket.data.isAdmin = true; // Custom property to identify the admin

    io.to(roomId).emit("broadcastStarted", {
      userId: user._id,
      userName: user.name,
    });

    console.log(`Broadcast started by admin: ${user.name}`);
  });

  // Handle admin reconnect
  socket.on("reconnectAdmin", async () => {
    const room = await Room.findOne({ roomId });
    if (!room) return;

    if (room.admin.toString() === userId.toString()) {
      adminSockets[roomId] = socket.id;
      socket.data.isAdmin = true;
      socket.join(roomId);

      const user = await User.findById(userId);
      io.to(roomId).emit("broadcastResumed", {
        userId: user._id,
        userName: user.name,
      });

      console.log(
        `Admin reconnected and resumed broadcast for room: ${roomId}`
      );
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    const userIndex = activeUsers[roomId]?.findIndex(
      (user) => user.socketId === socket.id
    );

    // Remove user from active list
    if (userIndex !== -1) {
      activeUsers[roomId].splice(userIndex, 1);
      io.to(roomId).emit("updateUsers", {
        users: activeUsers[roomId],
      });
    }

    // If admin disconnects
    if (socket.data.isAdmin) {
      console.log(`Admin has disconnected from room: ${roomId}`);
      delete adminSockets[roomId];

      // Notify users that the broadcast has ended
      io.to(roomId).emit("broadcastEnded", {
        message: "Broadcast has ended. The admin has left the session.",
      });
    }
  });
});

export { app, io, server };
