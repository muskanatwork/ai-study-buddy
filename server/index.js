import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = ai.getGenerativeModel({
  model: "gemini-2.5-flash",
});


app.post("/summary", async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `
    Explain the topic "${topic}" in easy and simple language.
    Write 6–8 lines only.
    `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return res.json({ summary });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error generating summary" });
  }
});



app.post("/quiz", async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `
      Generate EXACTLY 5 MCQ questions on "${topic}".
      Each item must contain:
      - "question"
      - "options": ["A","B","C","D"]
      - "answer": "A"
      
      Return ONLY JSON array. No markdown, no backticks.
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    text = text.replace(/```json/g, "").replace(/```/g, "");

    let quiz;
    try {
      quiz = JSON.parse(text);
    } catch (err) {
      quiz = { raw: text };
    }

    return res.json({ quiz });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error generating quiz" });
  }
});



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
