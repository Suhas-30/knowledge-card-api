import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { where } from "sequelize"
import User from "../models/user.js"
import logger from "../utils/logger.js"
import { loginSchema } from "../validators/authSchema.js"


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

export const login = async(req, res)=>{
    const {email, password} = req.body;
    
    const {error} = loginSchema.validate({email, password});
    if(error) return res.status(400).json({error: error.details[0].message});

    try{
        const user = await User.findOne({where:{email}})
        if(!user) return res.stauts(401).json({error:"Invalid credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.stauts(401).json({error:"Invalid credentials"});

        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {
            expiresIn:"1h",
        })
        return res.status(200).json({message:"Login Successful", token});
    }catch(err){
        logger.error("Login failed:", err.message);
        return res.status(500).json({error:"Login failed"});
    }
}

// {
//     "name":"universe",
//     "email":"uni@email.com",
//     "password":"12345678"
// }