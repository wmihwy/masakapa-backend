import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ test route (optional)
app.get("/", (req, res) => {
  res.send("MasakApa Backend Running 🚀");
});

// ✅ main AI route
app.post("/generate", async (req, res) => {
  try {
    const { bahan } = req.body;

    // check input
    if (!bahan || bahan.length === 0) {
      return res.json({
        result: "Sila pilih bahan dulu 🙂"
      });
    }

    const prompt = `
Anda adalah chef profesional Malaysia.

Bahan:
${bahan.join(", ")}

Cadangkan 3 resepi lengkap.

Format:
Nama Resepi:
Masa:
Tahap:
Bahan:
Cara Memasak:
Tips:

Gunakan Bahasa Melayu.
Pastikan resepi realistik dan sedap.
`;

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
          messages: [
            { role: "user", content: prompt }
          ],
        }),
      }
    );

    const data = await response.json();

    // ✅ DEBUG (lihat kat Render log)
    console.log("AI RESPONSE:", JSON.stringify(data, null, 2));

    // ❌ kalau error dari OpenAI
    if (!data.choices || !data.choices[0]) {
      return res.json({
        result: "AI tak dapat generate resepi 😢",
        error: data
      });
    }

    // ✅ success
    const result = data.choices[0].message.content;

    res.json({
      result: result
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    res.json({
      result: "Server error 😢",
      error: error.message
    });
  }
});

// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
