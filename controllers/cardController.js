import axios from "axios";
import * as Cheerio from "cheerio";
import { generateSummary } from "../services/openaiServices.js";
import Card from "../models/card.js";
import { where } from "sequelize";

export const generatedCard = async (req, res) => {
  const { sourceType, content } = req.body;

  if (!content || !["text", "url"].includes(sourceType)) {
    return res.status(400).json({ error: "Invalid sourceType or content" });
  }

  let inputText = content;

  if (sourceType === "url") {
    try {
      const { data: html } = await axios.get(content);
      const $ = Cheerio.load(html);

      const title = $("title").text();
      const paragraphs = $("p")
        .map((i, el) => $(el).text())
        .get()
        .join(" ");
      inputText = `${title}.${paragraphs}`;
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch or parse URL" });
    }
  }

  let summary = await generateSummary(inputText);
  if (!summary) {
    summary = `Summary of: ${inputText.substring(0, 100)}...`;
  }
  const tags = Array.from(
    new Set(
      inputText
        .replace(/https?:\/\/[^\s]+/g, "")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 4)
    )
  ).slice(0, 3);

  try {
    const card = await Card.create({
      summary,
      tags,
      originalText: inputText,
      userId: req.user.id,
    });

    return res.status(201).json({ message: "Card saved", card });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save card" });
  }
};

export const getCards = async(req, res) =>{
  try{
    const card = await Card.findAll({where: {userId: req.user.id}});
    res.status(200).json({cards});
  }catch(err){
    res.status(500).json({error: "Failed to featch cards"});

  }
}

export const searchCards = async(req, res)=>{
  const {tags} = tags.query;
  try{
    const cards = await Card.findAll({
      where:{
        userId:req.user.id,
        tags:{
          [Op.contains] : [tags.toLowerCase()],
        }
      }
    })
    res.status(200).json({cards})
  }catch(error){
    res.status(500).json({error:"Search failed"})
  }
}


export const deleteCard = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Card.findOne({ where: { id, userId: req.user.id } });
    if (!card) return res.status(404).json({ error: "Card not found" });

    await card.destroy();
    res.status(200).json({ message: "Card deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete card" });
  }
};