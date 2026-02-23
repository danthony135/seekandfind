import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Load system prompt from file once at startup
const SYSTEM_PROMPT = readFileSync(
  join(__dirname, "docs", "the-billion-system-prompt-v1.md"),
  "utf-8"
);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(join(__dirname, "dist")));

app.post("/api/chat", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const { messages, lang, langName } = req.body;

  // Build system prompt with language instruction
  const system =
    SYSTEM_PROMPT +
    `\n\n## LANGUAGE INSTRUCTION\nThe user's interface language is ${langName || "English"} (${lang || "en"}). Always respond in the language the user writes in. If they write in ${langName || "English"}, respond in ${langName || "English"}. If they write in a different language, respond in that language. Be natural and culturally appropriate for the user's language.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("Anthropic API error:", err.message);
    res.status(500).json({ error: "Failed to reach AI service" });
  }
});

app.post("/api/analyze", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const { messages } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("Anthropic API error:", err.message);
    res.status(500).json({ error: "Failed to reach AI service" });
  }
});

// SPA fallback — serve index.html for all non-API routes (Express 5 syntax)
app.use((req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Seek & Find server running on port ${PORT}`);
});
