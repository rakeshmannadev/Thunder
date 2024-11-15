import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import albumRoutes from "./routes/album.routes.js";
import songRoutes from "./routes/song.routes.js";
import roomRoutes from "./routes/room.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectDb from "./db/connectDb.js";

dotenv.config();
const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(clerkMiddleware()); // it attach the user in req-> req.auth
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

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/albums", albumRoutes);
app.use("/api/v1/songs", songRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/messages", messageRoutes);

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is started at port: ${PORT}`);
  connectDb();
});
