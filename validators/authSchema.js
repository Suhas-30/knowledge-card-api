import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().min(6).max(100).required()
})