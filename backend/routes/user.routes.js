import express from "express";
import { authCheck } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/authCheck", authCheck);

export default router;
