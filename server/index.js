
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

// SUMMARY API 
app.post("/summary", async (req, res) => {
  try {
    const { topic, level } = req.body;

    let levelInstruction = "";

    if (level === "basic") {
      levelInstruction = "Explain in very simple, beginner-friendly and easy words. Avoid difficult technical terms.";
    } else if (level === "intermediate") {
      levelInstruction = "Explain with moderate detail, simple examples, and slightly deeper concepts.";
    } else if (level === "advanced") {
      levelInstruction = "Explain with deep technical concepts, definitions, and advanced-level terminology.";
    }

    const prompt = `
      Topic: "${topic}"
      Level: ${level}
      ${levelInstruction}
      Write only 6–8 lines.
    `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return res.json({ summary });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error generating summary" });
  }
});

// QUIZ API 
app.post("/quiz", async (req, res) => {
  try {
    const { topic, level } = req.body;

    let difficultyInstruction = "";

    if (level === "basic") {
      difficultyInstruction = "Make the questions very simple and easy to understand. Beginner level.";
    } else if (level === "intermediate") {
      difficultyInstruction = "Make the questions moderately difficult with little reasoning.";
    } else if (level === "advanced") {
      difficultyInstruction = "Make the questions challenging, deep and technical.";
    }

    const prompt = `
      Generate EXACTLY 5 MCQs on "${topic}".
      Difficulty: ${level}
      ${difficultyInstruction}

      Each item must contain:
      - "question"
      - "options": ["A","B","C","D"]
      - "answer": "Possible Answer"

      Return ONLY JSON array.
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    text = text.replace(/```json/g, "").replace(/```/g, "");
    console.log(text)

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

// FLASHCARDS API
app.post("/flashcards", async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `
      Create 5 flashcards for topic "${topic}".
      Return JSON array only:
      [
        {"title": "Term 1", "description": "Short explanation"},
        {"title": "Term 2", "description": "Short explanation"},
        {"title": "Term 3", "description": "Short explanation"},
        {"title": "Term 4", "description": "Short explanation"},
        {"title": "Term 5", "description": "Short explanation"}
      ]
    `;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();
    text = text.replace(/```json/g, "").replace(/```/g, "");

    let flashcards;
    try {
      flashcards = JSON.parse(text);
    } catch (err) {
      flashcards = { raw: text };
    }

    return res.json({ flashcards });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error generating flashcards" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
