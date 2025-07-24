import { OpenAI } from "openai";
import dotenv from "dotenv"

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const generateSummary = async(text)=>{
    try{
        const response = await openai.chat.completions.create({
            model:"gpt-3.5-turbo",
            messages:[
                {
                    role:"system",
                    content: "You are a helpful assistant that summarizes educational content in a short, in simple way."
                },
                {
                    role: "user",
                    content: `Summarize the following:\n\n${text}` 
                }
            ],
            temperature: 0.7,
            max_tokens: 100
        });
        console.log(testSummary.choices[0].message.content);
        const summary = response.choices[0].message.content.trim();
        return summary;
    }catch(error){
        console.error("OpenAI Error:", error.message);
        return null;
    }
}