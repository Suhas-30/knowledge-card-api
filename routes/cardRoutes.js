import express from "express";
import { deleteCard, generatedCard, searchCards, getCards } from "../controllers/cardController.js";
import verifyToken from "../middleware/auth.js";
import { cardLimit } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/generate", verifyToken, cardLimit, generatedCard);
router.get("/", verifyToken, getCards);
router.get("/search", verifyToken, searchCards);
router.delete("/:id", verifyToken, deleteCard);

export default router;