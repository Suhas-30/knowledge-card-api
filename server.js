import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./config/db.js";
import logger from "./utils/logger.js";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.get("/", (req, res)=>{
    return res.status(200).json({message:"API is running"})
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

sequelize.sync().then(()=>{
    app.listen(process.env.PORT, ()=>{
        logger.info(`Server running on http://localhost:${process.env.PORT}`);
    })
}).catch((error)=>{
    logger.error("Failed to sync with DB:", error);
})