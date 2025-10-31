import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testGeminiAPI() {
    console.log("Testing Gemini API connection...");
    console.log("API Key present:", !!GEMINI_API_KEY);
    
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Say hello!" }] }]
                }),
            }
        );

        if (!response.ok) {
            console.error("Error status:", response.status);
            const errorText = await response.text();
            console.error("Error details:", errorText);
            return;
        }

        const data = await response.json();
        console.log("Success! API responded with:", data);
    } catch (err) {
        console.error("Error testing API:", err);
    }
}

testGeminiAPI();