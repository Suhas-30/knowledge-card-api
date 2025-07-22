import bcrypt from "bcrypt"
import User from "../models/user.js"
import logger from "../utils/logger.js"

export const register = async(req, res)=>{
    try{
        const {name, email, password} = req.body;

        const exists = await User.findOne({where:{email}});
        if(exists)
        {
            return res.status(400).json({error:"Email already exists"})
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({name, email, password:hash});

        return res.status(201).json({message: "User registered", user});
    }catch(error){
        logger.error("Register failed: "+error.message);
        return res.status(500).json({error:"Register Failed"});
    }
}