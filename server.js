import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { bahan } = req.body;

  const prompt = `
Anda chef Malaysia.

Bahan:
${bahan.join(", ")}

Bagi 3 resepi lengkap dalam Bahasa Melayu.
`;

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();

    res.json({
      result: data.choices[0].message.content,
    });

  } catch (err) {
    res.json({ error: "Error AI" });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});

const data = await response.json();

console.log("AI RESPONSE:", data); // tambah ini

if (!data.choices) {
  return res.json({
    result: "Error dari AI 😢",
    debug: data
  });
}

res.json({
  result: data.choices[0].message.content,
});
