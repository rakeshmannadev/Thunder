import express from "express";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

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
});
