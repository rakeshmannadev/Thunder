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
  const { roomId, userId } = socket.handshake.query;
  console.log("User connected " + socket.id);
  // When a user joins a room
  socket.on("joinRoom", async ({ userId, roomId }) => {
    // Join the room
    socket.join(roomId);

    const user = await User.findById(userId);
    if (!user) return;

    if (user.role === "admin") {
      // Store the admin's socket ID for tracking
      adminSockets[roomId] = socket.id;
      socket.join(roomId); // Admin joins the room
      socket.data.isAdmin = true;
      io.to(roomId).emit("adminJoins", { message: "Admin joined room" });
    }

    // Add user to activeUsers
    if (!activeUsers[roomId]) {
      activeUsers[roomId] = [];
    }
    activeUsers[roomId].push(userId);
    console.log(`${userId} joined room ${roomId}`);

    // Emit the active users in that room
    const activeUsersInRoom = activeUsers[roomId] || [];
    io.to(roomId).emit("updateUsers", { users: activeUsersInRoom });
  });

  // When a user leaves a room
  socket.on("leaveRoom", ({ userId, roomId }) => {
    // check if admin
    if (socket.data.isAdmin) {
      console.log(`Admin has disconnected from room: ${roomId}`);
      delete adminSockets[roomId];
      // Notify users that the broadcast has ended
      io.to(roomId).emit("broadcastEnded", { message: "Broadcast ended" });
    }

    // Leave the room // if users
    if (activeUsers[roomId]) {
      activeUsers[roomId] = activeUsers[roomId].filter(
        (user) => user !== userId
      );
      // Update the active users and broadcast it
      const activeUsersInRoom = activeUsers[roomId] || [];
      io.to(roomId).emit("updateUsers", { users: activeUsersInRoom });
      socket.leave(roomId);
      console.log(`${userId} left room ${roomId}`);
    }
  });

  // Initialize broadcast
  socket.on("initializeBroadcast", async ({ userId, roomId }) => {
    const room = await Room.findOne({ roomId });
    if (!room) return;

    if (room.admin.toString() !== userId.toString()) return;

    const user = await User.findById(userId);
    if (!user) return;

    console.log("Initialize broadcast");

    io.to(roomId).emit("broadcastStarted", {
      userName: user.name,
      userId: user._id,
    });

    console.log(`Broadcast started by admin: ${user.name}`);
  });

  socket.on("playSong", async ({ userId, roomId, songId }) => {
    const room = await Room.findOne({ roomId });
    if (!room) return;

    if (room.admin.toString() !== userId.toString()) return;

    io.to(roomId).emit("songStarted", { songId });

    console.log(`Song played by admin: ${songId}`);
  })

  socket.on("pauseSong",async({userId,roomId,songId})=>{
    const room = await Room.findOne({ roomId });
    if (!room) return;

    if (room.admin.toString() !== userId.toString()) return;

    io.to(roomId).emit("songPaused", { songId });

    console.log(`Song paused by admin: ${songId}`);
  })

  socket.on("endBroadcast", async ({ userId, roomId }) => {
    const room = await Room.findOne({ roomId });
    if (!room) return;

    if (room.admin.toString() !== userId.toString()) return;

    const user = await User.findById(userId);
    if (!user) return;

    io.to(roomId).emit("broadcastEnded", {
      message: `Broadcast has ended by ${user.name}`,
    });

    console.log(`Broadcast ended by admin: ${user.name}`);
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    if (socket.data.isAdmin) {
      console.log(`Admin has disconnected from room: ${roomId}`);
      // Notify users that the broadcast has ended
      io.to(roomId).emit("broadcastEnded", { message: "Broadcast has ended" });
      delete adminSockets[roomId];
    }

    // Leave the room // if users
    if (activeUsers[roomId]) {
      activeUsers[roomId] = activeUsers[roomId].filter(
        (user) => user !== userId
      );
      // Update the active users and broadcast it
      const activeUsersInRoom = activeUsers[roomId] || [];
      io.to(roomId).emit("updateUsers", { users: activeUsersInRoom });
      socket.leave(roomId);
      console.log(`${userId} left room ${roomId}`);
    }

    console.log("user disconnected " + socket.id);
  });
});

export { app, io, server };
