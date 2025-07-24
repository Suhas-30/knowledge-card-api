import express from "express";
import { generatedCard } from "../controllers/cardController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", verifyToken, generatedCard);

export default router;