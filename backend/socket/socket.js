import { Server } from "socket.io";
import express from "express";
import http from "http";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { deleteRoom, removeMember } from "../controllers/room.controller.js";
import {
  adminDeleteMessage,
  deleteForEveryone,
  editMessage,
  sendMessage,
} from "../controllers/message.controller.js";
const app = express();

const server = http.createServer(app);
const CLIENT_URL_WEB = process.env.CLIENT_URL_WEB;
const CLIENT_URL_NATIVE = process.env.CLIENT_URL_NATIVE;

const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL_WEB, CLIENT_URL_NATIVE],
    methods: ["GET", "POST"],
  },
});

// Function to get the key by value
function getKeyByValue(obj, value) {
  return Object.keys(obj).find((key) => obj[key].includes(value));
}

const activeUsers = {}; // tracks active users by roomid
const userSockets = {}; // tracks active users sockets by roomid
const adminSockets = {}; // tracks admin socket ids by roomid
const currentSong = {}; // tracks current song by roomid
const currentSongTime = {}; // tracks current song time by songId
const songRequsts = {}; // tracks song requests by roomId

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;
  console.log("User connected " + socket.id);
  adminSockets[userId] = socket.id; // { userId: socketId}

  // When a user joins a room
  socket.on("joinRoom", async ({ userId, roomId }) => {
    socket.join(roomId);

    const user = await User.findById(userId);
    if (!user) return;

    if (user.role === "admin") {
      // Store the admin's socket ID for tracking
      socket.join(roomId);
      socket.data.isAdmin = true;
      io.to(roomId).emit("adminJoins", {
        message: "Admin joined room",
        roomId,
      });
    }

    // Add user to activeUsers
    if (!activeUsers[roomId]) {
      activeUsers[roomId] = [];
      userSockets[roomId] = [];
    }
    activeUsers[roomId].push(userId); // { roomId: [userId]}
    userSockets[roomId].push(socket.id); // { roomId: [socketId]}
    io.to(socket.id).emit("userJoins", {
      message: "You have joined the room ",
      roomId,
    });
    console.log(`${userId} joined room ${roomId}`);

    // Check if there is any current song playing

    if (currentSong[roomId]) {
      let currentSongRequest = null;
      let requestedUser = null;
      if (songRequsts[roomId]) {
        currentSongRequest = songRequsts[roomId][currentSong[roomId]];
      }

      if (currentSongRequest) {
        requestedUser = currentSongRequest.user;
      }

      io.to(socket.id).emit("songStarted", {
        songId: currentSong[roomId].songId,
        userName: requestedUser ? null : currentSong[roomId].user.name,
        userId: requestedUser ? null : currentSong[roomId].user._id,
        requestedUser: requestedUser,
      });

      io.to(socket.id).emit("timeUpdated", {
        currentTime: currentSongTime[currentSong[roomId]],
      });
    }

    // Emit the active users in that room
    const activeUsersInRoom = activeUsers[roomId] || [];
    io.to(roomId).emit("updateUsers", { users: activeUsersInRoom });
  });

  // When a user leaves a room
  socket.on("leaveRoom", ({ userId, roomId }) => {
    // check if admin
    if (socket.data.isAdmin) {
      console.log(`Admin has disconnected from room: ${roomId}`);
      // Notify users that the broadcast has ended
      io.to(roomId).emit("broadcastEnded", { message: "Broadcast ended" });
      currentSong[roomId] = "";
    }

    // Leave the room // if users
    if (activeUsers[roomId]) {
      activeUsers[roomId] = activeUsers[roomId].filter(
        (user) => user !== userId
      );
      userSockets[roomId] = userSockets[roomId].filter(
        (socketId) => socketId !== socket.id
      );
      // Update the active users and broadcast it
      const activeUsersInRoom = activeUsers[roomId] || [];
      io.to(roomId).emit("updateUsers", { users: activeUsersInRoom });
      socket.leave(roomId);
      console.log(`${userId} left room ${roomId}`);
    }
  });

  // send join request to admin
  socket.on("sendJoinRequest", async ({ userId, roomId }) => {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        io.to(socket.id).emit("joinRequestStatus", {
          status: false,
          message: "Room not found",
        });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        io.to(socket.id).emit("joinRequestStatus", {
          status: false,
          message: "User not found",
        });
        return;
      }

      if (room.visability === "private") {
        if (room.participants.includes(userId)) {
          io.to(socket.id).emit("joinRequestStatus", {
            status: false,
            message: "You are already a member of this room",
          });
          return;
        }

        const existRequest = room.requests.some(
          (request) => request.user.userId.toString() === userId.toString()
        );

        if (existRequest) {
          io.to(socket.id).emit("joinRequestStatus", {
            status: false,
            message: "Request already send",
          });

          return;
        }

        room.requests.push({
          user: {
            userId,
            userName: user.name,
          },
          status: "pending",
          room: roomId,
        });
        await room.save();

        // send notification to admin
        const adminSocket = adminSockets[room.admin.toString()];

        if (adminSocket) {
          io.to(adminSocket).emit("joinRequest", {
            request: {
              user: {
                userId,
                userName: user.name,
                userImage: user.image,
              },
              status: "pending",
              room: {
                _id: room._id,
                roomId: roomId,
                image: room.image,
                roomName: room.roomName,
              },
            },
          });
        }

        io.to(socket.id).emit("joinRequestStatus", {
          status: true,
          message: "Request send successfully",
          room,
        });
      }
    } catch (error) {
      console.log("Error in send join request socket event", error.message);
    }
  });

  // accept join request
  socket.on("acceptJoinRequest", async ({ userId, roomId }) => {
    try {
      if (!roomId || !userId)
        return io.to(socket.id).emit("joinRequestStatus", {
          status: false,
          message: "Please provide roomId and userId",
        });

      const room = await Room.findById(roomId);
      if (!room)
        return io.to(socket.id).emit("joinRequestStatus", {
          status: false,
          message: "No room is available with this roomid",
        });

      const adminUserId = getKeyByValue(adminSockets, socket.id);

      if (adminUserId.toString() !== room.admin.toString())
        return io.to(socket.id).emit("joinRequestStatus", {
          status: false,
          message: "Only room admin can do that",
        });

      if (room.participants.includes(userId)) {
        return io.to(socket.id).emit("joinRequestStatus", {
          status: false,
          message: "User is already a member of this group",
        });
      }

      room.participants.push(userId);
      room.requests = room.requests.filter(
        (request) => request.user.userId.toString() !== userId.toString()
      );

      const otherUser = await User.findById(userId);
      if (otherUser) {
        otherUser.rooms.push(roomId);
      }
      Promise.all([room.save(), otherUser.save()]);
      const userSocketId = adminSockets[userId];
      if (userSocketId) {
        io.to([userSocketId, socket.id]).emit("joinRequestAccepted", {
          room,
          userId: adminUserId,
        });
      }
    } catch (error) {
      console.log("Error in accept request socket event", error.message);
    }
  });

  // reject join request
  socket.on("rejectJoinRequest", async ({ userId, roomId }) => {
    try {
      if (!roomId || !userId)
        return io.to(socket.id).emit("joinRequestStatus", {
          status: false,
          message: "Please provide roomId and userId",
        });

      const room = await Room.findById(roomId);
      if (!room)
        return io.to(socket.id).emit("joinRequestStatus", {
          status: false,
          message: "No room is available with this roomid",
        });

      const adminUserId = getKeyByValue(adminSockets, socket.id);

      if (adminUserId.toString() !== room.admin.toString())
        return io.to(socket.id).emit("joinRequestStatus", {
          status: false,
          message: "Only room admin can do that",
        });

      if (room.participants.includes(userId)) {
        return io.to(socket.id).emit("joinRequestStatus", {
          status: false,
          message: "User is already a member of this group",
        });
      }
      room.requests = room.requests.filter(
        (request) => request.user.userId.toString() !== userId.toString()
      );

      await room.save();
      const userSocketId = adminSockets[userId];
      if (userSocketId) {
        io.to([userSocketId, socket.id]).emit("joinRequestRejected", {
          room,
          message: "Join request rejected by admin 🙁",
          userId: adminUserId,
          memberId: userId,
        });
      }
    } catch (error) {
      console.log("Error in reject join request socket event", error.message);
    }
  });

  // kick user from room
  socket.on("kickMember", async ({ userId, roomId, memberId }) => {
    try {
      const response = await removeMember(userId, roomId, memberId);
      if (response.status) {
        // notify the member
        const memberSocketId = adminSockets[memberId.toString()];
        if (memberSocketId) {
          io.to(memberSocketId).emit("kickedFromRoom", {
            message: `You have been kicked from ${response.room.roomName} by admin`,
            roomId,
            image: response.room.image,
            roomName: response.room.roomName,
          });
        }
        // notify admin
        io.to(socket.id).emit("userKicked", {
          message: "User kicked",
          roomId,
          memberId,
        });
        socket.leave(roomId);
      }
    } catch (error) {
      console.log("Error in kickUser socket event", error.message);
    }
  });

  // send song request

  socket.on("sendSongRequest", async ({ userId, roomId, song }) => {
    const room = await Room.findOne({ roomId });
    const user = await User.findById(userId);
    if (!user) return console.log("User not found");
    if (!room) return console.log("Room not found");
    if (!room.participants.includes(userId))
      return console.log("You are not a member");

    const adminSocket = adminSockets[room.admin.toString()];
    if (!songRequsts[roomId]) {
      songRequsts[roomId] = {};
    }
    songRequsts[roomId][song._id] = { user };
    io.to(adminSocket).emit("newSongRequest", { song, user });
  });

  // delete room

  socket.on("deleteRoom", async ({ userId, roomId, room_id }) => {
    try {
      const response = await deleteRoom(userId, roomId);
      if (response.status) {
        console.log(response.message);
        io.to(room_id).emit("roomDeleted", {
          message: response.message,
          roomId,
          room: response.room,
        });
        delete activeUsers[room_id];
        socket.leave(room_id);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  // Chat section

  socket.on("sendMessage", async ({ content, senderId, roomId }) => {
    const response = await sendMessage(content, senderId, roomId);
    if (response.status) {
      io.to(roomId).emit("newMessage", { message: response.message, roomId });
    }
  });

  // admin deletes message

  socket.on("adminDeleteMessage", async ({ roomId, messageId, adminId }) => {
    const response = await adminDeleteMessage(roomId, messageId, adminId);
    if (response.status) {
      io.to(roomId).emit("adminDeletedMessage", { roomId, messageId });
    } else {
      console.log(response.message);
    }
  });

  // delete for everyone
  socket.on("deleteForEveryone", async ({ roomId, messageId, senderId }) => {
    const response = await deleteForEveryone(roomId, messageId, senderId);
    if (response.status) {
      io.to(roomId).emit("deletedForEveryone", { roomId, messageId });
    } else {
      console.log(response.message);
    }
  });

  // edit message
  socket.on("editMessage", async ({ roomId, messageId, senderId, content }) => {
    const response = await editMessage(roomId, messageId, senderId, content);
    if (response.status) {
      io.to(roomId).emit("messageEdited", {
        roomId,
        messageId,
        senderId,
        content,
      });
    } else {
      console.log(response.message);
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

  socket.on("playSong", async ({ userId, roomId, songId, requestedUserId }) => {
    const room = await Room.findOne({ roomId });
    if (!room) return;
    const user = await User.findById(userId);
    if (!user) return console.log("user not found");

    let requestedUser = null;
    if (requestedUserId) {
      requestedUser = await User.findById(requestedUserId);
    }

    if (room.admin.toString() !== userId.toString()) return;

    io.to(roomId).emit("songStarted", {
      songId,
      userName: user.name,
      requestedUser,
      userId,
    });

    // push songId into currentSong map
    if (!currentSong[roomId]) {
      currentSong[roomId] = {};
    }

    currentSong[roomId] = { songId, user };
    console.log(`current songId ${currentSong[roomId].songId}`);
    console.log(`Song played by admin: ${songId}`);
  });
  socket.on("updateTime", ({ roomId, currentTime }) => {
    currentSongTime[currentSong[roomId]] = currentTime;
    console.log("Time updated");
  });
  socket.on("pauseSong", async ({ userId, roomId, songId }) => {
    const room = await Room.findOne({ roomId });
    if (!room) return;

    if (room.admin.toString() !== userId.toString()) return;

    io.to(roomId).emit("songPaused", { songId });

    console.log(`Song paused by admin: ${songId}`);
  });

  socket.on("endBroadcast", async ({ userId, roomId }) => {
    const room = await Room.findOne({ roomId });
    if (!room) return;

    if (room.admin.toString() !== userId.toString()) return;

    const user = await User.findById(userId);
    if (!user) return;

    io.to(roomId).emit("broadcastEnded", {
      message: `Broadcast has ended by ${user.name}`,
    });

    currentSong[roomId] = "";

    console.log(`Broadcast ended by admin: ${user.name}`);
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    if (socket.data.isAdmin) {
      const roomId = getKeyByValue(userSockets, socket.id);
      console.log("RoomId: " + roomId);
      console.log(`Admin has disconnected from room: ${roomId}`);
      // Notify users that the broadcast has ended
      io.to(roomId).emit("broadcastEnded", { message: "Broadcast has ended" });
      delete adminSockets[userId];
    }

    // Leave the room // if users
    const roomId = getKeyByValue(userSockets, socket.id);
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
