import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// TOPIC CATEGORIES (kept for ConversationsTab local analysis)
// ============================================================
const CATEGORIES = [
  { id: "existence", label: "God's Existence", color: "#f59e0b", keywords: ["is god real", "does god exist", "proof", "evidence", "atheist", "agnostic", "believe"] },
  { id: "suffering", label: "Suffering & Evil", color: "#ef4444", keywords: ["suffering", "pain", "evil", "why did god", "death", "died", "grief", "loss", "hurt", "cancer", "sick"] },
  { id: "identity-jesus", label: "Who Is Jesus", color: "#3b82f6", keywords: ["who is jesus", "jesus god", "son of god", "christ", "messiah", "resurrection"] },
  { id: "purpose", label: "Purpose & Meaning", color: "#8b5cf6", keywords: ["purpose", "meaning", "why am i here", "point of life", "what am i supposed to", "calling"] },
  { id: "afterlife", label: "Heaven, Hell & Afterlife", color: "#06b6d4", keywords: ["heaven", "hell", "afterlife", "die", "death", "eternal", "after death"] },
  { id: "forgiveness", label: "Forgiveness & Grace", color: "#10b981", keywords: ["forgive", "forgiveness", "too late", "too far", "sin", "guilt", "shame", "grace"] },
  { id: "prayer", label: "Prayer", color: "#f97316", keywords: ["pray", "prayer", "talk to god", "hear god", "listen"] },
  { id: "bible", label: "Bible & Scripture", color: "#6366f1", keywords: ["bible", "scripture", "word of god", "old testament", "new testament", "verse"] },
  { id: "church", label: "Church & Community", color: "#ec4899", keywords: ["church", "community", "fellowship", "denomination", "hurt by church", "hypocr"] },
  { id: "relationships", label: "Relationships", color: "#14b8a6", keywords: ["marriage", "divorce", "relationship", "dating", "family", "parent", "friend"] },
  { id: "mental-health", label: "Mental Health", color: "#a855f7", keywords: ["anxiety", "depression", "mental", "lonely", "scared", "panic", "suicid", "hopeless"] },
  { id: "sexuality", label: "Sexuality & Gender", color: "#f43f5e", keywords: ["gay", "lgbtq", "homosexual", "transgender", "sexuality", "gender", "same-sex"] },
  { id: "other-religions", label: "Other Religions", color: "#0ea5e9", keywords: ["islam", "muslim", "hindu", "buddhist", "religion", "allah", "quran", "karma", "reincarnation"] },
  { id: "decision", label: "Decision / Salvation", color: "#22c55e", keywords: ["accept", "follow jesus", "become christian", "ready", "give my life", "born again", "saved", "salvation"] },
  { id: "dreams", label: "Dreams & Visions", color: "#d946ef", keywords: ["dream", "vision", "man in white", "saw jesus", "appeared"] },
  { id: "science", label: "Science & Faith", color: "#64748b", keywords: ["science", "evolution", "big bang", "creation", "dinosaur"] },
  { id: "general", label: "General / Other", color: "#78716c", keywords: [] },
];

function categorizeConversation(messages) {
  const text = messages.map(m => m.content).join(" ").toLowerCase();
  const scores = {};

  for (const cat of CATEGORIES) {
    if (cat.id === "general") continue;
    let score = 0;
    for (const kw of cat.keywords) {
      const regex = new RegExp(kw, "gi");
      const matches = text.match(regex);
      if (matches) score += matches.length;
    }
    if (score > 0) scores[cat.id] = score;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return ["general"];

  const top = sorted.filter(([_, s]) => s >= sorted[0][1] * 0.4).slice(0, 3);
  return top.map(([id]) => id);
}

function getConversationStats(convo) {
  const msgs = convo.messages || [];
  const userMsgs = msgs.filter(m => m.role === "user");
  const aiMsgs = msgs.filter(m => m.role === "assistant");
  const hasConnect = msgs.some(m => m.showConnect);
  const categories = categorizeConversation(msgs);

  return {
    messageCount: msgs.length,
    userMessages: userMsgs.length,
    aiMessages: aiMsgs.length,
    hasConnect,
    categories,
    duration: convo.updatedAt - convo.createdAt,
    avgUserLength: userMsgs.length ? Math.round(userMsgs.reduce((s, m) => s + m.content.length, 0) / userMsgs.length) : 0,
  };
}

// ============================================================
// COMPONENTS
// ============================================================

function formatDuration(ms) {
  if (ms < 60000) return "< 1 min";
  if (ms < 3600000) return `${Math.round(ms / 60000)} min`;
  return `${(ms / 3600000).toFixed(1)} hrs`;
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
      <p className="text-stone-500 text-xs mb-1">{label}</p>
      <p className="text-2xl font-light" style={{ color: color || "#e7e5e4", fontFamily: "'Georgia', serif" }}>{value}</p>
      {sub && <p className="text-stone-600 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ============================================================
// OVERVIEW TAB — now uses server-side aggregate stats
// ============================================================
function OverviewTab({ stats, connects }) {
  const { totalMessages, totalChats, decisionsTriggered, languages, dailyMessages } = stats;

  // Language distribution
  const sortedLangs = Object.entries(languages || {}).sort((a, b) => b[1] - a[1]);
  const maxLangCount = sortedLangs[0]?.[1] || 1;

  // Daily messages chart (last 30 days)
  const now = new Date();
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    return { date: key, count: (dailyMessages || {})[key] || 0 };
  });
  const maxDaily = Math.max(...last30.map(d => d.count), 1);

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Chats" value={totalChats || 0} color="#f59e0b" />
        <StatCard label="Total Messages" value={totalMessages || 0} />
        <StatCard label="Decisions Triggered" value={decisionsTriggered || 0} sub={totalChats ? `${(((decisionsTriggered || 0) / totalChats) * 100).toFixed(1)}% rate` : ""} color="#22c55e" />
        <StatCard label="Connect Requests" value={connects.length} color="#3b82f6" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Languages Used" value={Object.keys(languages || {}).length} />
        <StatCard label="Need Follow-up" value={connects.filter(c => !c.followedUp).length} color="#f59e0b" />
        <StatCard label="New Believers" value={connects.filter(c => c.need === "just-decided").length} color="#22c55e" />
        <StatCard label="Top Language" value={sortedLangs[0]?.[0]?.toUpperCase() || "—"} sub={sortedLangs[0] ? `${sortedLangs[0][1]} messages` : ""} />
      </div>

      {/* Daily messages chart */}
      <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
        <p className="text-stone-400 text-sm mb-4" style={{ fontFamily: "'Georgia', serif" }}>Messages — Last 30 Days</p>
        <div className="flex items-end gap-1 h-32">
          {last30.map((d, i) => {
            const height = Math.max(2, (d.count / maxDaily) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="w-full bg-amber-400/30 hover:bg-amber-400/50 rounded-sm transition-colors cursor-default" style={{ height: `${height}%` }} />
                <div className="absolute -top-8 bg-stone-800 text-stone-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}: {d.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Language breakdown */}
      <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
        <p className="text-stone-400 text-sm mb-4" style={{ fontFamily: "'Georgia', serif" }}>Language Distribution</p>
        {sortedLangs.length === 0 && <p className="text-stone-600 text-sm">No messages yet.</p>}
        <div className="space-y-3">
          {sortedLangs.map(([lang, count]) => (
            <div key={lang} className="flex items-center gap-3">
              <span className="text-stone-400 text-sm flex-shrink-0 w-16 uppercase">{lang}</span>
              <div className="flex-1 bg-stone-800 rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full bg-amber-400/60 transition-all duration-500" style={{ width: `${(count / maxLangCount) * 100}%` }} />
              </div>
              <span className="text-stone-500 text-xs w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SIMPLE WORLD MAP — equirectangular projection with dots
// ============================================================
const WORLD_OUTLINE = "M2,74 L5,68 L8,64 L12,60 L18,56 L22,54 L28,50 L34,48 L38,46 L44,44 L50,42 L56,40 L62,38 L68,36 L74,34 L80,32 L86,30 L92,28 L98,26 L104,24 L110,22 L116,20 L122,18 L128,16 L134,14 L140,12 L146,10 L152,10 L158,12 L164,14 L170,16 L176,18 L182,20 L188,22 L194,24 L200,26";

function WorldMap({ chatlog }) {
  const width = 800;
  const height = 400;

  // Group by location (round to nearest degree for clustering)
  const locationCounts = {};
  const countryCount = {};

  for (const chat of chatlog) {
    if (!chat.geo) continue;
    const key = `${Math.round(chat.geo.lat)},${Math.round(chat.geo.lon)}`;
    if (!locationCounts[key]) {
      locationCounts[key] = { lat: chat.geo.lat, lon: chat.geo.lon, city: chat.geo.city, country: chat.geo.country, countryCode: chat.geo.countryCode, count: 0 };
    }
    locationCounts[key].count++;
    countryCount[chat.geo.country] = (countryCount[chat.geo.country] || 0) + 1;
  }

  const dots = Object.values(locationCounts);
  const maxCount = Math.max(...dots.map(d => d.count), 1);

  // Equirectangular projection
  const project = (lat, lon) => {
    const x = ((lon + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return [x, y];
  };

  const sortedCountries = Object.entries(countryCount).sort((a, b) => b[1] - a[1]);
  const maxCountry = sortedCountries[0]?.[1] || 1;
  const totalWithGeo = chatlog.filter(c => c.geo).length;

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5 overflow-hidden">
        <p className="text-stone-400 text-sm mb-4" style={{ fontFamily: "'Georgia', serif" }}>Conversations Around the World</p>
        <div className="relative w-full" style={{ aspectRatio: "2/1" }}>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            {/* Background */}
            <rect width={width} height={height} fill="#1c1917" rx="8" />

            {/* Grid lines */}
            {[...Array(7)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={(i * height) / 6} x2={width} y2={(i * height) / 6} stroke="#292524" strokeWidth="0.5" />
            ))}
            {[...Array(13)].map((_, i) => (
              <line key={`v${i}`} x1={(i * width) / 12} y1="0" x2={(i * width) / 12} y2={height} stroke="#292524" strokeWidth="0.5" />
            ))}

            {/* Equator */}
            <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#44403c" strokeWidth="0.5" strokeDasharray="4,4" />
            {/* Prime meridian */}
            <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="#44403c" strokeWidth="0.5" strokeDasharray="4,4" />

            {/* Dots */}
            {dots.map((d, i) => {
              const [x, y] = project(d.lat, d.lon);
              const r = 3 + (d.count / maxCount) * 12;
              return (
                <g key={i}>
                  {/* Glow */}
                  <circle cx={x} cy={y} r={r * 2} fill="#f59e0b" opacity={0.08} />
                  {/* Dot */}
                  <circle cx={x} cy={y} r={r} fill="#f59e0b" opacity={0.6} stroke="#f59e0b" strokeWidth="1" />
                  <circle cx={x} cy={y} r={Math.max(2, r * 0.4)} fill="#fbbf24" opacity={0.9} />
                  {/* Tooltip text for larger dots */}
                  {d.count >= 2 && (
                    <text x={x} y={y - r - 4} textAnchor="middle" fill="#a8a29e" fontSize="9" fontFamily="sans-serif">
                      {d.city || d.country} ({d.count})
                    </text>
                  )}
                </g>
              );
            })}

            {/* Label */}
            {dots.length === 0 && (
              <text x={width / 2} y={height / 2} textAnchor="middle" fill="#57534e" fontSize="14" fontFamily="Georgia, serif">
                No location data yet — chats will appear as dots
              </text>
            )}
          </svg>
        </div>
        <p className="text-stone-600 text-xs mt-2">{totalWithGeo} chat{totalWithGeo !== 1 ? "s" : ""} with location data</p>
      </div>

      {/* Country breakdown */}
      {sortedCountries.length > 0 && (
        <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
          <p className="text-stone-400 text-sm mb-4" style={{ fontFamily: "'Georgia', serif" }}>Countries</p>
          <div className="space-y-3">
            {sortedCountries.map(([country, count]) => (
              <div key={country} className="flex items-center gap-3">
                <span className="text-stone-400 text-sm flex-shrink-0 w-40 truncate">{country}</span>
                <div className="flex-1 bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400/60 transition-all duration-500" style={{ width: `${(count / maxCountry) * 100}%` }} />
                </div>
                <span className="text-stone-500 text-xs w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ACTIVITY TAB — world map + recent chat timeline
// ============================================================
function ActivityTab({ chatlog, stats }) {
  const [timeFilter, setTimeFilter] = useState("all");

  const now = Date.now();
  const filtered = chatlog.filter(c => {
    if (timeFilter === "24h") return now - c.ts < 24 * 60 * 60 * 1000;
    if (timeFilter === "7d") return now - c.ts < 7 * 24 * 60 * 60 * 1000;
    if (timeFilter === "30d") return now - c.ts < 30 * 24 * 60 * 60 * 1000;
    return true;
  });

  // Hourly heatmap data (from chatlog only — needs per-chat data)
  const hourCounts = Array(24).fill(0);
  const dayCounts = Array(7).fill(0);
  for (const c of filtered) {
    const d = new Date(c.ts);
    hourCounts[d.getHours()]++;
    dayCounts[d.getDay()]++;
  }
  const maxHour = Math.max(...hourCounts, 1);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const maxDay = Math.max(...dayCounts, 1);

  // Historical daily messages from analytics (server-side aggregate data, pre-chatlog)
  const { dailyMessages, totalChats: serverTotalChats, totalMessages: serverTotalMessages, languages } = stats;
  const dailyEntries = Object.entries(dailyMessages || {}).sort((a, b) => a[0].localeCompare(b[0]));
  const maxDailyHist = Math.max(...dailyEntries.map(([, c]) => c), 1);

  // Use server totals if chatlog is smaller (chatlog only has new data, server has all history)
  const displayTotalChats = Math.max(filtered.length, timeFilter === "all" ? (serverTotalChats || 0) : filtered.length);
  const displayTotalMessages = Math.max(
    filtered.reduce((s, c) => s + (c.messages || 1), 0),
    timeFilter === "all" ? (serverTotalMessages || 0) : filtered.reduce((s, c) => s + (c.messages || 1), 0)
  );

  // Connects with country data — show on map alongside chatlog geo
  // (connects are passed via stats.connectsList if available)

  return (
    <div className="space-y-8">
      {/* Filter buttons */}
      <div className="flex gap-2">
        {[
          { id: "all", label: "All Time" },
          { id: "30d", label: "30 Days" },
          { id: "7d", label: "7 Days" },
          { id: "24h", label: "24 Hours" },
        ].map(f => (
          <button key={f.id} onClick={() => setTimeFilter(f.id)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${timeFilter === f.id ? "bg-amber-400/10 border border-amber-400/30 text-amber-200" : "text-stone-500 hover:text-stone-300 border border-stone-800"}`}>
            {f.label}
          </button>
        ))}
        <span className="text-stone-600 text-xs self-center ml-2">{filtered.length} tracked chats{timeFilter === "all" && serverTotalChats > filtered.length ? ` (${serverTotalChats} total including pre-tracking)` : ""}</span>
      </div>

      {/* Stat cards */}
      {(() => {
        const geoChats = filtered.filter(c => c.geo);
        const countryCounts = {};
        const cityCounts = {};
        for (const c of geoChats) {
          if (c.geo.country) countryCounts[c.geo.country] = (countryCounts[c.geo.country] || 0) + 1;
          if (c.geo.city) {
            const key = `${c.geo.city}, ${c.geo.country}`;
            cityCounts[key] = (cityCounts[key] || 0) + 1;
          }
        }
        const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]);
        const topCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
        return (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Chats" value={displayTotalChats} color="#f59e0b" />
              <StatCard label="Total Messages" value={displayTotalMessages} />
              <StatCard label="Countries" value={topCountries.length} color="#3b82f6" sub={topCountries[0]?.[0] || ""} />
              <StatCard label="Cities" value={topCities.length} color="#8b5cf6" sub={topCities[0]?.[0] || ""} />
            </div>
            {(topCountries.length > 0 || topCities.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topCountries.length > 0 && (
                  <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
                    <p className="text-stone-400 text-sm mb-3" style={{ fontFamily: "'Georgia', serif" }}>Countries</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {topCountries.map(([country, count]) => (
                        <div key={country} className="flex items-center justify-between">
                          <span className="text-stone-300 text-sm">{country}</span>
                          <span className="text-stone-500 text-xs">{count} chat{count !== 1 ? "s" : ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {topCities.length > 0 && (
                  <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
                    <p className="text-stone-400 text-sm mb-3" style={{ fontFamily: "'Georgia', serif" }}>Cities</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {topCities.map(([city, count]) => (
                        <div key={city} className="flex items-center justify-between">
                          <span className="text-stone-300 text-sm">{city}</span>
                          <span className="text-stone-500 text-xs">{count} chat{count !== 1 ? "s" : ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        );
      })()}

      {/* Historical daily messages chart (from server analytics — shows ALL history) */}
      {dailyEntries.length > 0 && timeFilter === "all" && (
        <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
          <p className="text-stone-400 text-sm mb-1" style={{ fontFamily: "'Georgia', serif" }}>Daily Messages — Full History</p>
          <p className="text-stone-600 text-xs mb-4">From server analytics (includes activity before location tracking was added)</p>
          <div className="flex items-end gap-px h-28">
            {dailyEntries.map(([date, count], i) => {
              const height = Math.max(2, (count / maxDailyHist) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative" style={{ minWidth: "2px" }}>
                  <div className="w-full bg-amber-400/30 hover:bg-amber-400/50 rounded-sm transition-colors cursor-default" style={{ height: `${height}%` }} />
                  <div className="absolute -top-8 bg-stone-800 text-stone-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}: {count} msgs
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-stone-700 text-xs">{dailyEntries[0]?.[0]}</span>
            <span className="text-stone-700 text-xs">{dailyEntries[dailyEntries.length - 1]?.[0]}</span>
          </div>
        </div>
      )}

      {/* Language breakdown from server analytics (full history) */}
      {Object.keys(languages || {}).length > 0 && timeFilter === "all" && (
        <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
          <p className="text-stone-400 text-sm mb-1" style={{ fontFamily: "'Georgia', serif" }}>Languages — Full History</p>
          <p className="text-stone-600 text-xs mb-4">From server analytics</p>
          <div className="space-y-3">
            {Object.entries(languages).sort((a, b) => b[1] - a[1]).map(([lang, count]) => {
              const maxLang = Object.values(languages).reduce((a, b) => Math.max(a, b), 1);
              return (
                <div key={lang} className="flex items-center gap-3">
                  <span className="text-stone-400 text-sm flex-shrink-0 w-16 uppercase">{lang}</span>
                  <div className="flex-1 bg-stone-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400/60 transition-all duration-500" style={{ width: `${(count / maxLang) * 100}%` }} />
                  </div>
                  <span className="text-stone-500 text-xs w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* World map */}
      <WorldMap chatlog={filtered} />

      {/* Hour of day heatmap */}
      <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
        <p className="text-stone-400 text-sm mb-4" style={{ fontFamily: "'Georgia', serif" }}>Activity by Hour (Server Time)</p>
        <div className="flex items-end gap-1 h-24">
          {hourCounts.map((count, h) => {
            const height = Math.max(2, (count / maxHour) * 100);
            return (
              <div key={h} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="w-full bg-amber-400/30 hover:bg-amber-400/50 rounded-sm transition-colors cursor-default" style={{ height: `${height}%` }} />
                <div className="absolute -top-8 bg-stone-800 text-stone-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {h}:00 — {count} chat{count !== 1 ? "s" : ""}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-stone-700 text-xs">12am</span>
          <span className="text-stone-700 text-xs">6am</span>
          <span className="text-stone-700 text-xs">12pm</span>
          <span className="text-stone-700 text-xs">6pm</span>
          <span className="text-stone-700 text-xs">12am</span>
        </div>
      </div>

      {/* Day of week */}
      <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
        <p className="text-stone-400 text-sm mb-4" style={{ fontFamily: "'Georgia', serif" }}>Activity by Day of Week</p>
        <div className="flex items-end gap-2 h-20">
          {dayCounts.map((count, d) => {
            const height = Math.max(4, (count / maxDay) * 100);
            return (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-amber-400/40 hover:bg-amber-400/60 rounded-sm transition-colors cursor-default" style={{ height: `${height}%` }} />
                <span className="text-stone-600 text-xs">{dayNames[d]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent chats timeline */}
      <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
        <p className="text-stone-400 text-sm mb-4" style={{ fontFamily: "'Georgia', serif" }}>Recent Chats</p>
        {filtered.length === 0 && <p className="text-stone-600 text-sm">No chats in this time period.</p>}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {[...filtered].sort((a, b) => b.ts - a.ts).slice(0, 100).map(c => {
            const d = new Date(c.ts);
            const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
            const isConnect = c.type === "connect";
            return (
              <div key={c.id} className="flex items-center gap-3 py-2 border-b border-stone-800/20 last:border-0">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full ${isConnect ? "bg-green-400/60" : "bg-amber-400/60"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-300 text-sm">{dateStr}</span>
                    <span className="text-stone-600 text-xs">{timeStr}</span>
                    {isConnect && <span className="text-green-500 text-xs">Connect Request</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {c.geo?.country ? (
                      <span className="text-stone-500 text-xs">{c.geo.city}{c.geo.city && c.geo.country ? ", " : ""}{c.geo.country}</span>
                    ) : (
                      <span className="text-stone-700 text-xs">Unknown location</span>
                    )}
                    {!isConnect && (
                      <>
                        <span className="text-stone-700 text-xs">&middot;</span>
                        <span className="text-stone-600 text-xs">{c.messages || 1} msg{(c.messages || 1) !== 1 ? "s" : ""}</span>
                        <span className="text-stone-700 text-xs">&middot;</span>
                        <span className="text-stone-600 text-xs uppercase">{c.lang}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONVERSATIONS TAB — keeps localStorage (private by design)
// ============================================================
function ConversationsTab() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("seekme_conversations")) || [];
      setConversations(stored);
    } catch {}
  }, []);

  const enriched = conversations.map(c => ({ ...c, stats: getConversationStats(c) }))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const filtered = enriched.filter(c => {
    if (filter !== "all" && !c.stats.categories.includes(filter)) return false;
    if (search) {
      const text = c.messages.map(m => m.content).join(" ").toLowerCase();
      if (!text.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  if (selected) {
    const convo = conversations.find(c => c.id === selected);
    if (!convo) return null;
    const stats = getConversationStats(convo);
    return (
      <div>
        <button onClick={() => setSelected(null)} className="text-stone-500 hover:text-stone-300 text-xs mb-6 block transition-colors">&larr; Back to conversations</button>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-stone-200 text-lg mb-1" style={{ fontFamily: "'Georgia', serif" }}>{convo.title}</h3>
            <p className="text-stone-500 text-xs">{formatDate(convo.createdAt)} &middot; {stats.messageCount} messages &middot; {formatDuration(stats.duration)}</p>
          </div>
          <div className="flex gap-1.5">
            {stats.categories.map(catId => {
              const cat = CATEGORIES.find(c => c.id === catId);
              return cat ? <span key={catId} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: cat.color + "40", color: cat.color }}>{cat.label}</span> : null;
            })}
          </div>
        </div>
        {stats.hasConnect && <div className="bg-green-900/20 border border-green-700/30 rounded-lg px-4 py-2 mb-6 text-green-400 text-xs">&#10022; Decision moment triggered — connect form was shown</div>}
        <div className="space-y-4 max-w-2xl">
          {convo.messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-prose rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-stone-800 text-stone-200 rounded-br-md" : "bg-stone-900/80 text-stone-400 rounded-bl-md border border-stone-800/30"}`}
                style={{ whiteSpace: "pre-wrap" }}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-stone-600 text-xs mb-4">Showing conversations from this browser's localStorage (conversations are private by design).</p>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
          className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-4 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-400/30" />
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-400 outline-none">
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      <p className="text-stone-600 text-xs mb-4">{filtered.length} conversation{filtered.length !== 1 ? "s" : ""}</p>
      <div className="space-y-2">
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelected(c.id)}
            className="bg-stone-900/30 hover:bg-stone-900/60 border border-stone-800/30 rounded-xl px-5 py-4 cursor-pointer transition-colors group">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-stone-300 text-sm truncate group-hover:text-stone-100 transition-colors">{c.title}</p>
                <p className="text-stone-600 text-xs mt-1">{formatDate(c.createdAt)} &middot; {c.stats.messageCount} msgs &middot; {formatDuration(c.stats.duration)}</p>
              </div>
              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                {c.stats.hasConnect && <span className="text-green-500 text-xs">&#10022; Decision</span>}
                {c.stats.categories.slice(0, 2).map(catId => {
                  const cat = CATEGORIES.find(x => x.id === catId);
                  return cat ? <span key={catId} className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} title={cat.label} /> : null;
                })}
              </div>
            </div>
            {c.messages.length > 0 && (
              <p className="text-stone-600 text-xs mt-2 truncate">{c.messages[0].content.slice(0, 120)}...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// CONNECTS TAB — uses server-side data + followup button
// ============================================================
function ConnectsTab({ connects, onFollowUp }) {
  if (connects.length === 0) return <p className="text-stone-600">No connect requests yet.</p>;

  const needLabels = {
    "just-decided": "Just decided to follow Jesus",
    "find-church": "Looking for a church",
    "find-bible": "Needs a Bible",
    "talk-to-someone": "Wants to talk to a person",
    "struggling": "Going through difficulty",
    "other": "Other",
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Requests" value={connects.length} color="#3b82f6" />
        <StatCard label="New Believers" value={connects.filter(c => c.need === "just-decided").length} color="#22c55e" />
        <StatCard label="Need Follow-up" value={connects.filter(c => !c.followedUp).length} color="#f59e0b" />
      </div>
      <div className="space-y-3">
        {[...connects].sort((a, b) => (b.ts || 0) - (a.ts || 0)).map((c) => (
          <div key={c.id || c.ts} className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-stone-200 text-sm font-medium">{c.name || "Anonymous"}</p>
                <p className="text-stone-500 text-xs mt-0.5">{c.contactType}: {c.contact}</p>
                {c.country && <p className="text-stone-600 text-xs">{c.country}</p>}
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${c.need === "just-decided" ? "bg-green-900/30 text-green-400 border border-green-700/30" : "bg-stone-800 text-stone-400 border border-stone-700"}`}>
                  {needLabels[c.need] || c.need}
                </span>
                {c.ts && <p className="text-stone-700 text-xs">{formatDate(c.ts)}</p>}
                {c.id && !c.followedUp && (
                  <button onClick={() => onFollowUp(c.id)}
                    className="text-xs bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-200 px-3 py-1 rounded-lg transition-colors">
                    Mark Followed Up
                  </button>
                )}
                {c.followedUp && (
                  <span className="text-xs text-green-500">Followed up</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// AI ANALYSIS TAB
// ============================================================
function AnalysisTab() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      // Use local conversations for analysis content
      let conversations = [];
      try { conversations = JSON.parse(localStorage.getItem("seekme_conversations")) || []; } catch {}

      const summaries = conversations.slice(0, 30).map(c => {
        const stats = getConversationStats(c);
        const firstUser = c.messages.find(m => m.role === "user")?.content || "";
        const categories = stats.categories.map(id => CATEGORIES.find(x => x.id === id)?.label).join(", ");
        return `[${formatDate(c.createdAt)}] Categories: ${categories} | ${stats.messageCount} msgs | First msg: "${firstUser.slice(0, 200)}" | Decision triggered: ${stats.hasConnect ? "YES" : "no"}`;
      }).join("\n");

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `You are an analytics assistant for a Christian gospel conversation platform. Analyze these ${conversations.length} conversations and provide insights. Be specific and actionable. Format with clear sections.

Here are summaries of the most recent conversations:

${summaries}

Please provide:
1. KEY PATTERNS: What topics and questions come up most? What are people really asking about?
2. SPIRITUAL JOURNEY INSIGHTS: Where are people in their journey? How many seem to be genuinely seeking vs. curious vs. hostile?
3. DECISION MOMENTS: How often are people reaching decision points? What seems to lead them there?
4. IMPROVEMENT OPPORTUNITIES: Where could the conversations be better? What topics need better handling?
5. NOTABLE CONVERSATIONS: Any standout conversations — particularly meaningful, difficult, or surprising?
6. RECOMMENDATIONS: Top 3 things to focus on next.

Keep it concise and practical. This is for the platform builder, not a report for donors.`
          }]
        }),
      });
      const data = await res.json();
      setAnalysis(data.content?.map(b => b.text || "").join("") || "Analysis failed.");
    } catch (e) {
      setAnalysis("Error running analysis: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-stone-300 text-sm" style={{ fontFamily: "'Georgia', serif" }}>AI-Powered Insights</p>
          <p className="text-stone-600 text-xs mt-1">Uses Claude to analyze conversation patterns, topics, and opportunities.</p>
        </div>
        <button onClick={runAnalysis} disabled={loading}
          className="bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-200 text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-30">
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>
      {analysis && (
        <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-6">
          <div className="text-stone-400 text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "'Georgia', serif" }}>
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// INLINE MARKDOWN RENDERER (no dependencies)
// ============================================================
function renderMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let inList = false;
  let listItems = [];
  let listType = "ul";
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === "ol") {
        elements.push(<ol key={key++} className="list-decimal list-inside space-y-1 text-stone-400 text-sm mb-4 ml-4">{listItems}</ol>);
      } else {
        elements.push(<ul key={key++} className="list-disc list-inside space-y-1 text-stone-400 text-sm mb-4 ml-4">{listItems}</ul>);
      }
      listItems = [];
      inList = false;
    }
  };

  const inlineFormat = (str) => {
    // Bold
    str = str.replace(/\*\*(.+?)\*\*/g, '<strong class="text-stone-200 font-semibold">$1</strong>');
    // Italic
    str = str.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Inline code
    str = str.replace(/`([^`]+)`/g, '<code class="bg-stone-800 text-amber-300 px-1.5 py-0.5 rounded text-xs">$1</code>');
    return str;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Headings
    const h1 = trimmed.match(/^# (.+)/);
    if (h1) { flushList(); elements.push(<h1 key={key++} className="text-stone-100 text-2xl font-light mt-8 mb-4 pb-2 border-b border-stone-800/50" style={{ fontFamily: "'Georgia', serif" }} dangerouslySetInnerHTML={{ __html: inlineFormat(h1[1]) }} />); continue; }

    const h2 = trimmed.match(/^## (.+)/);
    if (h2) { flushList(); elements.push(<h2 key={key++} className="text-stone-200 text-xl font-light mt-6 mb-3" style={{ fontFamily: "'Georgia', serif" }} dangerouslySetInnerHTML={{ __html: inlineFormat(h2[1]) }} />); continue; }

    const h3 = trimmed.match(/^### (.+)/);
    if (h3) { flushList(); elements.push(<h3 key={key++} className="text-stone-300 text-lg font-medium mt-5 mb-2" style={{ fontFamily: "'Georgia', serif" }} dangerouslySetInnerHTML={{ __html: inlineFormat(h3[1]) }} />); continue; }

    const h4 = trimmed.match(/^#### (.+)/);
    if (h4) { flushList(); elements.push(<h4 key={key++} className="text-stone-300 text-base font-medium mt-4 mb-2" dangerouslySetInnerHTML={{ __html: inlineFormat(h4[1]) }} />); continue; }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) { flushList(); elements.push(<hr key={key++} className="border-stone-800 my-6" />); continue; }

    // Blockquote
    const bq = trimmed.match(/^> (.+)/);
    if (bq) { flushList(); elements.push(<blockquote key={key++} className="border-l-2 border-amber-400/40 pl-4 text-stone-400 text-sm italic my-3" dangerouslySetInnerHTML={{ __html: inlineFormat(bq[1]) }} />); continue; }

    // Ordered list
    const ol = trimmed.match(/^\d+\.\s+(.+)/);
    if (ol) { if (!inList || listType !== "ol") { flushList(); inList = true; listType = "ol"; } listItems.push(<li key={key++} dangerouslySetInnerHTML={{ __html: inlineFormat(ol[1]) }} />); continue; }

    // Unordered list
    const ul = trimmed.match(/^[-*]\s+(.+)/);
    if (ul) { if (!inList || listType !== "ul") { flushList(); inList = true; listType = "ul"; } listItems.push(<li key={key++} dangerouslySetInnerHTML={{ __html: inlineFormat(ul[1]) }} />); continue; }

    // Regular paragraph
    flushList();
    elements.push(<p key={key++} className="text-stone-400 text-sm leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed) }} />);
  }

  flushList();
  return elements;
}

// ============================================================
// PROMPT REVIEW TAB
// ============================================================
const SUGGESTION_CATEGORIES = [
  "Theological Accuracy",
  "Scriptural Support",
  "Pastoral Sensitivity",
  "Cultural Sensitivity",
  "Missing Content",
  "Edge Case Handling",
  "Tone",
];

const SUGGESTION_PRIORITIES = ["Critical", "Important", "Suggestion"];

function PromptReviewTab({ suggestionCount }) {
  const [view, setView] = useState("document"); // "document" | "manage"
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingPrompt, setLoadingPrompt] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [form, setForm] = useState({ replacement: "", reason: "", category: SUGGESTION_CATEGORIES[0], priority: "Suggestion", reviewer: "" });
  const [submitting, setSubmitting] = useState(false);
  const promptRef = useRef(null);

  useEffect(() => {
    fetchPrompt();
    fetchSuggestions();
  }, []);

  const fetchPrompt = async () => {
    setLoadingPrompt(true);
    try {
      const res = await fetch("/api/admin/prompt");
      const data = await res.json();
      setPrompt(data.prompt || "");
    } catch { setPrompt("Failed to load system prompt."); }
    setLoadingPrompt(false);
  };

  const fetchSuggestions = async () => {
    try {
      const res = await fetch("/api/admin/suggestions");
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch {}
  };

  const handleTextSelection = () => {
    const sel = window.getSelection();
    const text = sel?.toString()?.trim();
    if (text && text.length > 2 && promptRef.current?.contains(sel.anchorNode)) {
      setSelectedText(text);
      setForm({ replacement: "", reason: "", category: SUGGESTION_CATEGORIES[0], priority: "Suggestion", reviewer: "" });
      setShowForm(true);
    }
  };

  const submitSuggestion = async () => {
    if (!selectedText || !form.replacement.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/admin/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedText, ...form }),
      });
      setShowForm(false);
      setSelectedText("");
      fetchSuggestions();
    } catch {}
    setSubmitting(false);
  };

  const reviewSuggestion = async (id, status) => {
    try {
      await fetch(`/api/admin/suggestions/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchSuggestions();
    } catch {}
  };

  const pendingCount = suggestions.filter(s => s.status === "pending").length;

  const inp = "w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-400/30 transition-colors";

  return (
    <div>
      {/* View toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button onClick={() => setView("document")}
            className={`text-sm px-4 py-2 rounded-lg transition-colors ${view === "document" ? "bg-amber-400/10 border border-amber-400/30 text-amber-200" : "text-stone-500 hover:text-stone-300 border border-stone-800"}`}>
            Document View
          </button>
          <button onClick={() => setView("manage")}
            className={`text-sm px-4 py-2 rounded-lg transition-colors ${view === "manage" ? "bg-amber-400/10 border border-amber-400/30 text-amber-200" : "text-stone-500 hover:text-stone-300 border border-stone-800"}`}>
            Manage Suggestions
            {pendingCount > 0 && <span className="ml-2 bg-amber-400/20 text-amber-300 text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
          </button>
        </div>
        <p className="text-stone-600 text-xs">{suggestions.length} total suggestion{suggestions.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Document View */}
      {view === "document" && (
        <div className="relative">
          <div className="bg-stone-900/30 border border-stone-800/30 rounded-xl p-4 mb-4">
            <p className="text-stone-500 text-xs">Select text in the document below to suggest an edit. Your suggestions will be reviewed by the team.</p>
          </div>

          {loadingPrompt ? (
            <div className="text-center py-20 text-stone-600">Loading system prompt...</div>
          ) : (
            <div ref={promptRef} onMouseUp={handleTextSelection}
              className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-8 max-w-4xl cursor-text selection:bg-amber-400/20">
              {renderMarkdown(prompt)}
            </div>
          )}

          {/* Suggestion form modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4" onClick={() => setShowForm(false)}>
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-stone-200 text-lg mb-4" style={{ fontFamily: "'Georgia', serif" }}>Suggest an Edit</h3>

                <div className="mb-4">
                  <p className="text-stone-500 text-xs mb-1">Selected text:</p>
                  <div className="bg-stone-800/50 border border-stone-700 rounded-lg px-3 py-2 text-sm text-amber-300/80 italic max-h-24 overflow-y-auto">
                    "{selectedText}"
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-stone-500 text-xs mb-1 block">Suggested replacement *</label>
                    <textarea value={form.replacement} onChange={e => setForm({...form, replacement: e.target.value})}
                      placeholder="What should this text say instead?"
                      rows={3} className={inp} style={{ resize: "vertical" }} />
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs mb-1 block">Reason for change</label>
                    <textarea value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}
                      placeholder="Why should this be changed? (scripture refs, theological concerns, etc.)"
                      rows={2} className={inp} style={{ resize: "vertical" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-500 text-xs mb-1 block">Category</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inp}>
                        {SUGGESTION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-stone-500 text-xs mb-1 block">Priority</label>
                      <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className={inp}>
                        {SUGGESTION_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-stone-500 text-xs mb-1 block">Your name</label>
                    <input type="text" value={form.reviewer} onChange={e => setForm({...form, reviewer: e.target.value})}
                      placeholder="Pastor John, Dr. Smith, etc." className={inp} />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={submitSuggestion} disabled={submitting || !form.replacement.trim()}
                      className="flex-1 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-200 text-sm py-2.5 rounded-lg transition-colors disabled:opacity-30">
                      {submitting ? "Submitting..." : "Submit Suggestion"}
                    </button>
                    <button onClick={() => setShowForm(false)} className="text-stone-500 hover:text-stone-300 text-sm px-4 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manage Suggestions View */}
      {view === "manage" && (
        <div>
          {suggestions.length === 0 && <p className="text-stone-600 text-sm">No suggestions yet. Go to Document View and select text to submit one.</p>}
          <div className="space-y-4">
            {[...suggestions].sort((a, b) => (b.ts || 0) - (a.ts || 0)).map(s => {
              const priorityColors = { Critical: "text-red-400 bg-red-900/20 border-red-700/30", Important: "text-amber-400 bg-amber-900/20 border-amber-700/30", Suggestion: "text-blue-400 bg-blue-900/20 border-blue-700/30" };
              const statusColors = { pending: "text-amber-300 bg-amber-400/10", accepted: "text-green-400 bg-green-900/20", rejected: "text-red-400 bg-red-900/20" };

              return (
                <div key={s.id} className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[s.priority] || priorityColors.Suggestion}`}>{s.priority}</span>
                      <span className="text-xs text-stone-500 bg-stone-800 px-2 py-0.5 rounded-full">{s.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[s.status] || ""}`}>{s.status}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-500 text-xs">{s.reviewer || "Anonymous"}</p>
                      {s.ts && <p className="text-stone-700 text-xs">{formatDate(s.ts)}</p>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-stone-500 text-xs mb-1">Original text:</p>
                    <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg px-3 py-2 text-sm text-red-300/60 line-through">
                      "{s.selectedText}"
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-stone-500 text-xs mb-1">Suggested replacement:</p>
                    <div className="bg-stone-800/50 border border-green-700/20 rounded-lg px-3 py-2 text-sm text-green-300/80">
                      "{s.replacement}"
                    </div>
                  </div>

                  {s.reason && (
                    <div className="mb-3">
                      <p className="text-stone-500 text-xs mb-1">Reason:</p>
                      <p className="text-stone-400 text-sm">{s.reason}</p>
                    </div>
                  )}

                  {s.status === "pending" && (
                    <div className="flex gap-2 pt-2 border-t border-stone-800/30">
                      <button onClick={() => reviewSuggestion(s.id, "accepted")}
                        className="text-xs bg-green-900/20 hover:bg-green-900/40 border border-green-700/30 text-green-400 px-4 py-1.5 rounded-lg transition-colors">
                        Accept
                      </button>
                      <button onClick={() => reviewSuggestion(s.id, "rejected")}
                        className="text-xs bg-red-900/20 hover:bg-red-900/40 border border-red-700/30 text-red-400 px-4 py-1.5 rounded-lg transition-colors">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN ADMIN APP
// ============================================================
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState({ totalChats: 0, totalMessages: 0, decisionsTriggered: 0, connects: 0, languages: {}, dailyMessages: {} });
  const [connects, setConnects] = useState([]);
  const [chatlog, setChatlog] = useState([]);
  const [suggestionCount, setSuggestionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const ADMIN_PASS = "seekme2026";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, sugRes, chatlogRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/suggestions"),
        fetch("/api/admin/chatlog"),
      ]);
      const statsData = await statsRes.json();
      const sugData = await sugRes.json();
      const chatlogData = await chatlogRes.json();

      const { connectsList, ...serverStats } = statsData;
      setStats(serverStats);
      setConnects(connectsList || []);
      // Merge chatlog with connect markers (connects that had country info)
      const allActivity = [...(chatlogData.chatlog || []), ...(chatlogData.connectMarkers || [])];
      setChatlog(allActivity);
      setSuggestionCount((sugData.suggestions || []).filter(s => s.status === "pending").length);
    } catch (e) {
      console.error("Failed to load admin data:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchData();
  }, [authed]);

  const handleFollowUp = async (id) => {
    try {
      await fetch(`/api/admin/connect/${id}/followup`, { method: "POST", headers: { "Content-Type": "application/json" } });
      setConnects(prev => prev.map(c => c.id === id ? { ...c, followedUp: true } : c));
    } catch {}
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center px-6">
        <div className="max-w-xs w-full">
          <h1 className="text-stone-200 text-xl mb-6 text-center" style={{ fontFamily: "'Georgia', serif" }}>Seek & Find — Admin</h1>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && pass === ADMIN_PASS) setAuthed(true); }}
            placeholder="Password"
            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-3 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-400/30 mb-3" />
          <button onClick={() => { if (pass === ADMIN_PASS) setAuthed(true); }}
            className="w-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-200 text-sm py-2.5 rounded-lg transition-colors">
            Enter
          </button>
          <p className="text-stone-700 text-xs text-center mt-4">Password: seekme2026</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity" },
    { id: "conversations", label: "Conversations" },
    { id: "connects", label: "Connects", badge: connects.filter(c => !c.followedUp).length },
    { id: "analysis", label: "AI Analysis" },
    { id: "prompt-review", label: "Prompt Review", badge: suggestionCount },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <div className="border-b border-stone-800/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-stone-200 font-medium" style={{ fontFamily: "'Georgia', serif" }}>&#10022; Seek & Find — Admin</h1>
            <span className="text-stone-700 text-xs">Dashboard</span>
          </div>
          <button onClick={fetchData} className="text-stone-500 hover:text-stone-300 text-xs transition-colors">
            {loading ? "Loading..." : "&#8635; Refresh"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-800/30 px-6">
        <div className="max-w-6xl mx-auto flex gap-0 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm transition-colors border-b-2 whitespace-nowrap ${tab === t.id ? "text-amber-300 border-amber-400/50" : "text-stone-500 hover:text-stone-300 border-transparent"}`}>
              {t.label}
              {t.badge > 0 && (
                <span className="ml-2 bg-amber-400/20 text-amber-300 text-xs px-1.5 py-0.5 rounded-full">{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {loading && !["conversations", "prompt-review"].includes(tab) ? (
            <div className="text-center py-20 text-stone-600">Loading data...</div>
          ) : (
            <>
              {tab === "overview" && <OverviewTab stats={stats} connects={connects} />}
              {tab === "activity" && <ActivityTab chatlog={chatlog} stats={stats} />}
              {tab === "conversations" && <ConversationsTab />}
              {tab === "connects" && <ConnectsTab connects={connects} onFollowUp={handleFollowUp} />}
              {tab === "analysis" && <AnalysisTab />}
              {tab === "prompt-review" && <PromptReviewTab suggestionCount={suggestionCount} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
