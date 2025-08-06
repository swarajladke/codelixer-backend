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

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // Other options: llama3-70b-8192, gemma-7b-it
        messages: [
          {
            role: "system",
            content: "You are a code assistant. Correct the user's code and explain what was wrong."
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
    const corrected = data.choices?.[0]?.message?.content?.trim();

    res.json({ response: corrected });
  } catch (err) {
    console.error("❌ Groq API error:", err);
    res.status(500).json({ error: 'Something went wrong with Groq API' });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Hello from CodeLixer backend using Groq!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Groq-based server is running on port ${PORT}`);
});
