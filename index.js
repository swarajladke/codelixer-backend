// index.js

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Make sure this is node-fetch v2
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/fix", async (req, res) => {
  const { prompt } = req.body;
  console.log("📥 Received prompt:", prompt);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,  // ✅ Use the variable!
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: "You are a code assistant. Correct the user's code and explain the issues."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();
    console.log("🧠 Groq raw response:", JSON.stringify(data, null, 2));

    const output = data?.choices?.[0]?.message?.content;

    if (!output) {
      return res.status(500).json({ error: "No response from Groq API" });
    }

    res.json({ response: output });
  } catch (err) {
    console.error("❌ Groq API error:", err);
    res.status(500).json({ error: "Something went wrong with Groq API" });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
