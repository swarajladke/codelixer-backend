// index.js or api.js
import express from 'express';
const fetch = require('node-fetch');

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // or try "anthropic/claude-3-haiku"
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      res.json({ result: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'No response from model', raw: data });
    }
  } catch (error) {
    console.error('OpenRouter error:', error);
    res.status(500).json({ error: 'Failed to get response from OpenRouter' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
