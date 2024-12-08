import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cron from "node-cron";
import fs from "fs";

import fileUpload from "express-fileupload";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import albumRoutes from "./routes/album.routes.js";
import songRoutes from "./routes/song.routes.js";
import roomRoutes from "./routes/room.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectDb from "./db/connectDb.js";
import { app, server } from "./socket/socket.js";

dotenv.config();
const __dirname = path.resolve();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  })
);

// cron jobs
const tempDir = path.join(process.cwd(), "temp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log("error", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/albums", albumRoutes);
app.use("/api/v1/songs", songRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
}

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({
    message: process.env.NODE_ENV === "production" ? err.message : err.message,
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is started at port: ${PORT}`);
  connectDb();
});
