import express from "express";
import { signup } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/auth/signup", signup);

export default router;
