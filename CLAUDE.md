# Seek & Find — Gospel AI Platform

## Project Overview
Free AI-powered gospel conversation platform. People explore questions about God, Jesus, faith, and life through personal conversations grounded in scripture. Modeled after how Jesus talked to people: questions, stories, patience, love.

## Stack
- **Frontend:** React (Vite) + Tailwind CSS v4
- **Backend:** Express.js proxy server (hides Anthropic API key)
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Hosting:** Railway
- **i18n:** 16 languages with RTL support (Arabic, Farsi, Urdu)

## Key Files
- `src/App.jsx` — Main app (landing page, 7 pages, chat interface, 20 SEO question pages, i18n)
- `src/Admin.jsx` — Admin dashboard (analytics, conversation viewer, connect form submissions)
- `src/translations.json` — UI translations for 16 languages
- `server.js` — Express backend proxy for Anthropic API
- `docs/the-billion-system-prompt-v1.md` — Full system prompt (Jesus' perspective)
- `docs/the-billion-framework.md` — Technical architecture and strategy

## Architecture
- **Frontend:** React SPA with hash routing, Tailwind CSS, Georgia serif font, dark stone palette with amber accents
- **Chat:** Proxied through `/api/chat` endpoint (server.js) to hide API key
- **Storage:** localStorage (no accounts, no server-side storage of conversations)
- **Translations:** 16 languages with browser auto-detection, RTL support for Arabic/Farsi/Urdu
- **System Prompt:** Extensive theological framework written from Jesus' perspective

## Languages (16)
English, Spanish, Portuguese, French, Arabic (RTL), Hindi, Chinese, Indonesian, Farsi (RTL), Tajik, Turkish, Swahili, Russian, Urdu (RTL), Bengali, Korean, Japanese

## Development
```bash
npm run dev        # Start Vite dev server (frontend)
node server.js     # Start backend (needs ANTHROPIC_API_KEY in .env)
npm run build      # Build for production
npm start          # Start production server (serves built frontend + API)
```

## Railway Deployment
1. Connect GitHub repo
2. Set environment variable: `ANTHROPIC_API_KEY=sk-ant-...`
3. Build command: `npm run build`
4. Start command: `npm start`

## Brand
- **Name:** "Seek & Find" (Matthew 7:7)
- **Design:** Dark stone palette (#0c0a09), amber accents, Georgia serif, minimal
- **Principle:** Free forever. No ads. No data sold.
