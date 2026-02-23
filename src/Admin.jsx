import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// TOPIC CATEGORIES
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
  
  // Return top 1-3 categories
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
// STORAGE - reads from persistent storage shared with main app
// ============================================================
const ADMIN_KEY = "seekme_admin_data";

async function loadAllData() {
  const data = { conversations: [], connects: [] };
  
  try {
    // Try persistent storage first
    const stored = await window.storage.get("seekme_all_conversations");
    if (stored?.value) data.conversations = JSON.parse(stored.value);
  } catch {}
  
  try {
    const stored = await window.storage.get("seekme_all_connects");
    if (stored?.value) data.connects = JSON.parse(stored.value);
  } catch {}

  // Also try localStorage as fallback (for prototype where user is also admin)
  try {
    const localConvos = JSON.parse(localStorage.getItem("seekme_conversations")) || [];
    const localConnects = JSON.parse(localStorage.getItem("seekme_connects")) || [];
    
    // Merge, deduplicating by id
    const existingIds = new Set(data.conversations.map(c => c.id));
    for (const c of localConvos) {
      if (!existingIds.has(c.id)) data.conversations.push(c);
    }
    data.connects = [...data.connects, ...localConnects];
  } catch {}
  
  return data;
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
// OVERVIEW TAB
// ============================================================
function OverviewTab({ conversations, connects }) {
  const allStats = conversations.map(c => getConversationStats(c));
  const totalMessages = allStats.reduce((s, st) => s + st.messageCount, 0);
  const totalUserMsgs = allStats.reduce((s, st) => s + st.userMessages, 0);
  const decisionsTriggered = allStats.filter(st => st.hasConnect).length;
  const avgMessages = conversations.length ? (totalMessages / conversations.length).toFixed(1) : 0;
  
  // Category distribution
  const catCounts = {};
  for (const st of allStats) {
    for (const cat of st.categories) {
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
  }
  const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const maxCatCount = sortedCats[0]?.[1] || 1;

  // Conversations over time (last 30 days)
  const now = Date.now();
  const dayMs = 86400000;
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const dayStart = now - (29 - i) * dayMs;
    const dayEnd = dayStart + dayMs;
    return conversations.filter(c => c.createdAt >= dayStart && c.createdAt < dayEnd).length;
  });

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Conversations" value={conversations.length} color="#f59e0b" />
        <StatCard label="Total Messages" value={totalMessages} sub={`${totalUserMsgs} from users`} />
        <StatCard label="Avg Messages / Convo" value={avgMessages} />
        <StatCard label="Decisions Triggered" value={decisionsTriggered} sub={conversations.length ? `${((decisionsTriggered / conversations.length) * 100).toFixed(1)}% rate` : ""} color="#22c55e" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Connect Requests" value={connects.length} color="#3b82f6" />
        <StatCard label="Unique Topics" value={Object.keys(catCounts).length} />
        <StatCard label="Convos Today" value={conversations.filter(c => c.createdAt > now - dayMs).length} />
        <StatCard label="Convos This Week" value={conversations.filter(c => c.createdAt > now - 7 * dayMs).length} />
      </div>

      {/* Activity chart */}
      <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
        <p className="text-stone-400 text-sm mb-4" style={{ fontFamily: "'Georgia', serif" }}>Conversations — Last 30 Days</p>
        <div className="flex items-end gap-1 h-32">
          {last30.map((count, i) => {
            const height = maxCatCount > 0 ? Math.max(2, (count / Math.max(...last30, 1)) * 100) : 2;
            const date = new Date(now - (29 - i) * dayMs);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="w-full bg-amber-400/30 hover:bg-amber-400/50 rounded-sm transition-colors cursor-default" style={{ height: `${height}%` }} />
                <div className="absolute -top-8 bg-stone-800 text-stone-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
        <p className="text-stone-400 text-sm mb-4" style={{ fontFamily: "'Georgia', serif" }}>Topic Categories</p>
        {sortedCats.length === 0 && <p className="text-stone-600 text-sm">No conversations yet.</p>}
        <div className="space-y-3">
          {sortedCats.map(([catId, count]) => {
            const cat = CATEGORIES.find(c => c.id === catId);
            if (!cat) return null;
            return (
              <div key={catId} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-stone-400 text-sm flex-shrink-0 w-40">{cat.label}</span>
                <div className="flex-1 bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(count / maxCatCount) * 100}%`, backgroundColor: cat.color, opacity: 0.6 }} />
                </div>
                <span className="text-stone-500 text-xs w-12 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONVERSATIONS TAB
// ============================================================
function ConversationsTab({ conversations }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

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
        <button onClick={() => setSelected(null)} className="text-stone-500 hover:text-stone-300 text-xs mb-6 block transition-colors">← Back to conversations</button>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-stone-200 text-lg mb-1" style={{ fontFamily: "'Georgia', serif" }}>{convo.title}</h3>
            <p className="text-stone-500 text-xs">{formatDate(convo.createdAt)} · {stats.messageCount} messages · {formatDuration(stats.duration)}</p>
          </div>
          <div className="flex gap-1.5">
            {stats.categories.map(catId => {
              const cat = CATEGORIES.find(c => c.id === catId);
              return cat ? <span key={catId} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: cat.color + "40", color: cat.color }}>{cat.label}</span> : null;
            })}
          </div>
        </div>
        {stats.hasConnect && <div className="bg-green-900/20 border border-green-700/30 rounded-lg px-4 py-2 mb-6 text-green-400 text-xs">✦ Decision moment triggered — connect form was shown</div>}
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
                <p className="text-stone-600 text-xs mt-1">{formatDate(c.createdAt)} · {c.stats.messageCount} msgs · {formatDuration(c.stats.duration)}</p>
              </div>
              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                {c.stats.hasConnect && <span className="text-green-500 text-xs">✦ Decision</span>}
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
// CONNECTS TAB
// ============================================================
function ConnectsTab({ connects }) {
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
        {connects.sort((a, b) => (b.ts || 0) - (a.ts || 0)).map((c, i) => (
          <div key={i} className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-stone-200 text-sm font-medium">{c.name || "Anonymous"}</p>
                <p className="text-stone-500 text-xs mt-0.5">{c.contactType}: {c.contact}</p>
                {c.country && <p className="text-stone-600 text-xs">{c.country}</p>}
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${c.need === "just-decided" ? "bg-green-900/30 text-green-400 border border-green-700/30" : "bg-stone-800 text-stone-400 border border-stone-700"}`}>
                  {needLabels[c.need] || c.need}
                </span>
                {c.ts && <p className="text-stone-700 text-xs mt-1">{formatDate(c.ts)}</p>}
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
function AnalysisTab({ conversations }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      // Build a summary of conversations for AI analysis
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
        <button onClick={runAnalysis} disabled={loading || conversations.length === 0}
          className="bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-200 text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-30">
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>
      {conversations.length === 0 && <p className="text-stone-600 text-sm">No conversations to analyze yet.</p>}
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
// MAIN ADMIN APP
// ============================================================
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState({ conversations: [], connects: [] });
  const [loading, setLoading] = useState(true);

  // Simple password - in production this would be real auth
  const ADMIN_PASS = "seekme2026";

  useEffect(() => {
    if (authed) {
      setLoading(true);
      loadAllData().then(d => { setData(d); setLoading(false); });
    }
  }, [authed]);

  const refresh = () => {
    setLoading(true);
    loadAllData().then(d => { setData(d); setLoading(false); });
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
    { id: "conversations", label: "Conversations" },
    { id: "connects", label: "Connects" },
    { id: "analysis", label: "AI Analysis" },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <div className="border-b border-stone-800/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-stone-200 font-medium" style={{ fontFamily: "'Georgia', serif" }}>✦ Seek & Find — Admin</h1>
            <span className="text-stone-700 text-xs">Dashboard</span>
          </div>
          <button onClick={refresh} className="text-stone-500 hover:text-stone-300 text-xs transition-colors">
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-800/30 px-6">
        <div className="max-w-6xl mx-auto flex gap-0">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm transition-colors border-b-2 ${tab === t.id ? "text-amber-300 border-amber-400/50" : "text-stone-500 hover:text-stone-300 border-transparent"}`}>
              {t.label}
              {t.id === "connects" && data.connects.length > 0 && (
                <span className="ml-2 bg-amber-400/20 text-amber-300 text-xs px-1.5 py-0.5 rounded-full">{data.connects.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20 text-stone-600">Loading data...</div>
          ) : (
            <>
              {tab === "overview" && <OverviewTab conversations={data.conversations} connects={data.connects} />}
              {tab === "conversations" && <ConversationsTab conversations={data.conversations} />}
              {tab === "connects" && <ConnectsTab connects={data.connects} />}
              {tab === "analysis" && <AnalysisTab conversations={data.conversations} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
