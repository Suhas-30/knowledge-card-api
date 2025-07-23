import { error } from "console";
import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs:10*60*1000,
    max:5,
    message:{error: "Too many login attempts. Please try again later."}
})