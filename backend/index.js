import express from "express";
import dotenv from "dotenv";
import path from "express";

import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";

import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import connectDb from "./db/connectDb.js";

dotenv.config();
const __dirname = path.resolve();

const app = express();

app.use(express.json());
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
app.use("/api/v1/admin", adminRoutes);

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
