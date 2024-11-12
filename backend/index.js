import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/user.routes.js";
import connectDb from "./db/connectDb.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(clerkMiddleware()); // it attach the user in req-> req.auth

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoutes);

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is started at port: ${PORT}`);
  connectDb();
});
