import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PORT = 5000;

// Proxy endpoint for frontend
app.post("/api/recommend", async (req, res) => {
  try {
    const { profile } = req.body;

    // Construct AI prompt dynamically
    const prompt = `
You are a professional Indian career counselor.
Given this student's details, generate:
1. Top 5 career options (in India).
2. Suggested education or skill paths to reach each career.
3. A short personalized career progress summary.

Student details:
Name: ${profile.name}
Education Level: ${profile.educationLevel}
Course: ${profile.course}
Skills: ${profile.skills.join(", ")}
Hobbies: ${profile.hobbies}
Learning Interests: ${profile.learning}
Location: ${profile.location}
    `;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ recommendation: text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Failed to fetch recommendation" });
  }
});

app.listen(PORT, () => console.log(`✅ Gemini AI server running on port ${PORT}`));
