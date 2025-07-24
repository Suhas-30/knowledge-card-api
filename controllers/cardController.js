import axios from "axios";
import * as Cheerio from "cheerio";
import { generateSummary } from "../services/openaiServices.js";

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

  return res.status(200).json({ summary, tags });
};
