import express from "express";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", verifyToken, (req, res)=>{
    res.json({
        message:"Protected route accessed",
        user: req.user,
    })
})

export default router