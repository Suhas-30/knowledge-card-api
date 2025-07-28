import express from "express";
import { deleteCard, generatedCard, searchCards } from "../controllers/cardController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", verifyToken, generatedCard);
router.get("/", verifyToken, getCards);
router.get("/search", verifyToken, searchCards);
router.delete("/:id", verifyToken, deleteCard);

export default router;