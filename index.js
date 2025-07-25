// index.js

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Ensure using v2 of node-fetch
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/fix", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "qwen/qwen3-coder",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const corrected = data.choices?.[0]?.message?.content?.trim();

    res.json({ response: corrected }); // ✅ key changed from `corrected` to `response`
  } catch (err) {
    console.error("❌ Backend error:", err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
app.get("/", (req, res) => {
  res.send("✅ Hello from CodeLixer backend!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('✅ Server is running on port 3000');
});
