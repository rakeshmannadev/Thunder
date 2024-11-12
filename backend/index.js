import express from "express";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is started at port: ${PORT}`);
});
