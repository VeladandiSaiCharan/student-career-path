import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); // allow cross-origin requests from frontend

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/recommend", async (req, res) => {
  try {
    const { userData } = req.body;
    if (!userData) return res.status(400).json({ error: "No user data provided" });

    const prompt = `
You are an expert career counselor in India.
Given this student's details, generate:
1. Top 5 career options.
2. Suggested education/skills paths.
3. Short personalized progress summary.

Student Details:
Name: ${userData.name}
Education Level: ${userData.educationLevel}
Course: ${userData.course}
Skills: ${(userData.skills || []).join(", ")}
Hobbies: ${userData.hobbies}
Learning Interests: ${userData.learning}
Location: ${userData.location}
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();
    console.log("Gemini API full response:", JSON.stringify(data, null, 2));
    const text =data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini API.";
    res.json({ recommendation: text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Failed to fetch recommendation" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
