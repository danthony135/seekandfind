import express from "express";
import cors from "cors";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// ============================================================
// DATA DIRECTORY — persists on Railway via volume or redeploys
// ============================================================
const DATA_DIR = join(__dirname, "data");
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR);

const CONNECTS_FILE = join(DATA_DIR, "connects.json");
const ANALYTICS_FILE = join(DATA_DIR, "analytics.json");
const SUGGESTIONS_FILE = join(DATA_DIR, "suggestions.json");

function loadJSON(file, fallback) {
  try {
    if (existsSync(file)) return JSON.parse(readFileSync(file, "utf-8"));
  } catch {}
  return fallback;
}

function saveJSON(file, data) {
  try {
    writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Failed to save ${file}:`, err.message);
  }
}

// ============================================================
// SYSTEM PROMPT — loaded once at startup
// ============================================================
const SYSTEM_PROMPT = readFileSync(
  join(__dirname, "docs", "the-billion-system-prompt-v1.md"),
  "utf-8"
);

// ============================================================
// RATE LIMITER — in-memory, per IP
// ============================================================
const rateLimits = new Map();
const RATE_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_MAX = 30; // 30 messages per minute per IP

function rateLimit(ip) {
  const now = Date.now();
  const entry = rateLimits.get(ip);

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateLimits.set(ip, { windowStart: now, count: 1 });
    return false; // not limited
  }

  entry.count++;
  if (entry.count > RATE_MAX) return true; // limited
  return false;
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimits) {
    if (now - entry.windowStart > RATE_WINDOW_MS * 2) rateLimits.delete(ip);
  }
}, 5 * 60 * 1000);

// ============================================================
// ANALYTICS — lightweight in-memory + periodic flush
// ============================================================
let analytics = loadJSON(ANALYTICS_FILE, {
  totalChats: 0,
  totalMessages: 0,
  decisionsTriggered: 0,
  connects: 0,
  languages: {},
  dailyMessages: {},
});

function trackChat(lang) {
  analytics.totalMessages++;
  analytics.languages[lang || "en"] = (analytics.languages[lang || "en"] || 0) + 1;

  const today = new Date().toISOString().slice(0, 10);
  analytics.dailyMessages[today] = (analytics.dailyMessages[today] || 0) + 1;

  // Trim daily history to last 90 days
  const keys = Object.keys(analytics.dailyMessages).sort();
  while (keys.length > 90) {
    delete analytics.dailyMessages[keys.shift()];
  }
}

function flushAnalytics() {
  saveJSON(ANALYTICS_FILE, analytics);
}

// Flush analytics every 2 minutes
setInterval(flushAnalytics, 2 * 60 * 1000);

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(join(__dirname, "dist")));

// Trust Railway's proxy for real client IP
app.set("trust proxy", true);

// ============================================================
// ROUTES
// ============================================================

// --- Chat endpoint ---
app.post("/api/chat", async (req, res) => {
  const ip = req.ip;
  if (rateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests. Please slow down and try again in a moment." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const { messages, lang, langName } = req.body;

  // Track analytics
  trackChat(lang);

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

    // Check if response contains a decision moment
    const text = data.content?.map((b) => b.text || "").join("") || "";
    if (text.includes("[SHOW_CONNECT]")) {
      analytics.decisionsTriggered++;
    }

    res.json(data);
  } catch (err) {
    console.error("Anthropic API error:", err.message);
    res.status(500).json({ error: "Failed to reach AI service" });
  }
});

// --- Connect form submission (server-side storage) ---
app.post("/api/connect", (req, res) => {
  const { name, contact, contactType, country, need } = req.body;

  if (!contact?.trim()) {
    return res.status(400).json({ error: "Contact info required" });
  }

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: name?.trim() || "Anonymous",
    contact: contact.trim(),
    contactType: contactType || "whatsapp",
    country: country?.trim() || "",
    need: need || "other",
    ts: Date.now(),
    followedUp: false,
  };

  const connects = loadJSON(CONNECTS_FILE, []);
  connects.push(entry);
  saveJSON(CONNECTS_FILE, connects);

  analytics.connects++;

  console.log(`[CONNECT] New ${need} request from ${entry.name} (${contactType}: ${contact})`);

  res.json({ ok: true });
});

// --- Admin analytics endpoint ---
app.get("/api/admin/stats", (req, res) => {
  const connects = loadJSON(CONNECTS_FILE, []);
  res.json({
    ...analytics,
    connectsList: connects,
  });
});

// --- Admin: mark connect as followed up ---
app.post("/api/admin/connect/:id/followup", (req, res) => {
  const connects = loadJSON(CONNECTS_FILE, []);
  const entry = connects.find((c) => c.id === req.params.id);
  if (!entry) return res.status(404).json({ error: "Not found" });
  entry.followedUp = true;
  saveJSON(CONNECTS_FILE, connects);
  res.json({ ok: true });
});

// --- Analyze endpoint (admin AI analysis) ---
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

// --- Admin: get system prompt for review ---
app.get("/api/admin/prompt", (req, res) => {
  res.json({ prompt: SYSTEM_PROMPT });
});

// --- Admin: get all suggestions ---
app.get("/api/admin/suggestions", (req, res) => {
  const suggestions = loadJSON(SUGGESTIONS_FILE, []);
  res.json({ suggestions });
});

// --- Admin: submit a new suggestion ---
app.post("/api/admin/suggestions", (req, res) => {
  const { selectedText, replacement, reason, category, priority, reviewer } = req.body;

  if (!selectedText?.trim() || !replacement?.trim()) {
    return res.status(400).json({ error: "Selected text and replacement are required" });
  }

  const suggestion = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    selectedText: selectedText.trim(),
    replacement: replacement.trim(),
    reason: reason?.trim() || "",
    category: category || "Theological Accuracy",
    priority: priority || "Suggestion",
    reviewer: reviewer?.trim() || "Anonymous",
    status: "pending",
    ts: Date.now(),
  };

  const suggestions = loadJSON(SUGGESTIONS_FILE, []);
  suggestions.push(suggestion);
  saveJSON(SUGGESTIONS_FILE, suggestions);

  console.log(`[SUGGESTION] New ${category} suggestion from ${suggestion.reviewer}`);

  res.json({ ok: true, suggestion });
});

// --- Admin: accept/reject a suggestion ---
app.post("/api/admin/suggestions/:id/review", (req, res) => {
  const { status } = req.body;
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Status must be 'accepted' or 'rejected'" });
  }

  const suggestions = loadJSON(SUGGESTIONS_FILE, []);
  const entry = suggestions.find((s) => s.id === req.params.id);
  if (!entry) return res.status(404).json({ error: "Not found" });

  entry.status = status;
  entry.reviewedAt = Date.now();
  saveJSON(SUGGESTIONS_FILE, suggestions);

  res.json({ ok: true });
});

// SPA fallback — serve index.html for all non-API routes (Express 5 syntax)
app.use((req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Seek & Find server running on port ${PORT}`);
  flushAnalytics(); // Save initial state
});
