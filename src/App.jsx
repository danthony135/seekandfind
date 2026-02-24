import { useState, useEffect, useRef } from "react";
import LANGS from "./translations.json";

// ============================================================
// i18n HELPERS
// ============================================================
const SUPPORTED = Object.keys(LANGS);
const RTL_LANGS = ["ar", "fa", "ur"];
const LANG_KEY = "seekme_lang";

function detectLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch {}
  const nav = (navigator.language || "en").toLowerCase();
  const exact = SUPPORTED.find((s) => nav === s || nav.startsWith(s + "-"));
  if (exact) return exact;
  const prefix = nav.split("-")[0];
  return SUPPORTED.find((s) => s === prefix) || "en";
}

// System prompt is now server-side (docs/the-billion-system-prompt-v1.md)

// ============================================================
// QUESTION SLUGS (URL routing — same across all languages)
// ============================================================
const SLUGS = [
  "is-god-real", "who-is-jesus", "why-does-god-allow-suffering",
  "what-is-the-meaning-of-life", "what-happens-when-you-die",
  "does-god-love-me", "how-do-i-pray", "is-the-bible-true",
  "why-is-there-evil", "can-i-know-god-personally",
  "does-god-forgive-everyone", "what-is-heaven-like", "is-hell-real",
  "why-did-god-let-this-happen", "how-to-find-my-purpose",
  "what-about-anxiety-and-depression", "i-had-a-dream-about-jesus",
  "is-it-too-late-for-me", "is-christianity-too-narrow", "church-hurt-me",
];

function getQuestions(t) {
  return SLUGS.map((slug, i) => ({ slug, question: t.qs?.[i]?.question || slug, intro: t.qs?.[i]?.intro || "" }));
}

// ============================================================
// HELPERS
// ============================================================
const STORAGE_KEY = "seekme_conversations";
const ACTIVE_KEY = "seekme_active";
const CONNECTS_KEY = "seekme_connects";
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const saveId = (id) => { try { if (id) localStorage.setItem(ACTIVE_KEY, id); else localStorage.removeItem(ACTIVE_KEY); } catch {} };

// ============================================================
// LANGUAGE SWITCHER
// ============================================================
function LangSwitcher({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="text-stone-500 hover:text-stone-300 transition-colors flex items-center gap-1 text-xs" title="Language">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9 9 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
        <span>{LANGS[lang]?.name || lang}</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 bg-stone-900 border border-stone-800 rounded-xl shadow-xl py-2 z-50 max-h-80 overflow-y-auto min-w-[160px]">
          {SUPPORTED.map((code) => (
            <button key={code} onClick={() => { setLang(code); setOpen(false); }} className={`block w-full text-left px-4 py-1.5 text-sm transition-colors ${code === lang ? "text-amber-300 bg-stone-800/50" : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/30"}`}>
              {LANGS[code].name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// CONNECT FORM
// ============================================================
function ConnectForm({ onClose, t }) {
  const [form, setForm] = useState({ name: "", contact: "", contactType: "whatsapp", country: "", need: "just-decided" });
  const [submitted, setSubmitted] = useState(false);
  const needs = [
    { v: "just-decided", l: t.cn.n1 },
    { v: "find-church", l: t.cn.n2 },
    { v: "find-bible", l: t.cn.n3 },
    { v: "talk-to-someone", l: t.cn.n4 },
    { v: "struggling", l: t.cn.n5 },
    { v: "other", l: t.cn.n6 },
  ];
  const submit = async () => {
    if (!form.contact.trim()) return;
    try { await fetch("/api/connect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); } catch {}
    const c = load(CONNECTS_KEY, []); c.push({ ...form, ts: Date.now() }); save(CONNECTS_KEY, c);
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="bg-amber-400/5 border border-amber-400/20 rounded-2xl p-5 my-3 max-w-sm">
      <div className="text-center">
        <p className="text-stone-200 text-sm font-medium mb-1" style={{ fontFamily: "'Georgia', serif" }}>{t.cn.ok}</p>
        <p className="text-stone-500 text-xs">{t.cn.okSub}</p>
      </div>
    </div>
  );

  const inp = "w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-400/40 transition-colors";
  return (
    <div className="bg-stone-900/80 border border-stone-700/50 rounded-2xl p-5 my-3 max-w-sm">
      <p className="text-stone-200 text-sm font-medium mb-1" style={{ fontFamily: "'Georgia', serif" }}>{t.cn.title}</p>
      <p className="text-stone-500 text-xs mb-4">{t.cn.sub}</p>
      <div className="space-y-3">
        <input type="text" placeholder={t.cn.name} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={inp} style={{ fontFamily: "'Georgia', serif" }} />
        <div className="flex gap-2">
          <select value={form.contactType} onChange={(e) => setForm({...form, contactType: e.target.value})} className="bg-stone-800 border border-stone-700 rounded-lg px-2 py-2 text-xs text-stone-400 outline-none focus:border-amber-400/40">
            <option value="whatsapp">{t.cn.wa}</option><option value="email">{t.cn.em}</option><option value="phone">{t.cn.ph}</option><option value="telegram">{t.cn.tg}</option>
          </select>
          <input type="text" placeholder={form.contactType === "email" ? t.cn.email : t.cn.number} value={form.contact} onChange={(e) => setForm({...form, contact: e.target.value})} className={`flex-1 ${inp}`} style={{ fontFamily: "'Georgia', serif" }} />
        </div>
        <input type="text" placeholder={t.cn.country} value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} className={inp} style={{ fontFamily: "'Georgia', serif" }} />
        <select value={form.need} onChange={(e) => setForm({...form, need: e.target.value})} className={`${inp} text-stone-400`}>
          {needs.map((n) => <option key={n.v} value={n.v}>{n.l}</option>)}
        </select>
        <div className="flex gap-2 pt-1">
          <button onClick={submit} disabled={!form.contact.trim()} className="flex-1 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 hover:border-amber-400/50 text-amber-200 text-sm py-2 rounded-lg transition-all disabled:opacity-30" style={{ fontFamily: "'Georgia', serif" }}>{t.cn.btn}</button>
          <button onClick={onClose} className="text-stone-600 hover:text-stone-400 text-xs px-3 transition-colors">{t.cn.notNow}</button>
        </div>
      </div>
      <p className="text-stone-700 text-xs mt-3 text-center">{t.cn.disc}</p>
    </div>
  );
}

// ============================================================
// NAV + FOOTER + PROMPT BOX
// ============================================================
function Nav({ navigate, current, t, lang, setLang }) {
  const [open, setOpen] = useState(false);
  const links = [{p:"/",l:t.nav.home},{p:"/questions",l:t.nav.questions},{p:"/how-it-works",l:t.nav.how},{p:"/about",l:t.nav.about},{p:"/chat",l:t.nav.start,a:true}];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/30">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="text-stone-200 font-medium" style={{ fontFamily: "'Georgia', serif" }}>Seek & Find</button>
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => <button key={l.p} onClick={() => navigate(l.p)} className={`text-xs transition-colors ${l.a ? "bg-amber-400/10 border border-amber-400/30 hover:border-amber-400/50 text-amber-200 px-3 py-1.5 rounded-full" : current===l.p ? "text-stone-200" : "text-stone-500 hover:text-stone-300"}`}>{l.l}</button>)}
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <LangSwitcher lang={lang} setLang={setLang} />
          <button onClick={() => setOpen(!open)} className="text-stone-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{open?<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>:<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"/>}</svg></button>
        </div>
      </div>
      {open && <div className="md:hidden border-t border-stone-800/30 bg-stone-950 px-6 py-3 space-y-2">{links.map((l) => <button key={l.p} onClick={() => {navigate(l.p);setOpen(false);}} className={`block w-full text-left text-sm py-2 ${l.a?"text-amber-300":"text-stone-400"}`}>{l.l}</button>)}</div>}
    </nav>
  );
}

function Footer({ navigate, t }) {
  return (
    <footer className="border-t border-stone-900 px-6 py-12 bg-stone-950">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-xs text-stone-600">
        <div><p className="text-stone-400 font-medium mb-2" style={{fontFamily:"'Georgia',serif"}}>Seek & Find</p><p>{t.ft.desc}</p></div>
        <div><p className="text-stone-400 font-medium mb-2">{t.ft.pages}</p>{[{p:"/",l:t.nav.home},{p:"/questions",l:t.nav.questions},{p:"/how-it-works",l:t.nav.how},{p:"/about",l:t.nav.about},{p:"/privacy",l:t.pv.title}].map(({p,l})=><button key={p} onClick={()=>navigate(p)} className="block text-stone-600 hover:text-stone-400 py-0.5">{l}</button>)}</div>
        <div><p className="text-stone-400 font-medium mb-2">{t.ft.promise}</p><p>{t.ft.promiseT}</p></div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-stone-900 text-center text-xs text-stone-700">&copy; 2026 &middot; {t.ft.verse}</div>
    </footer>
  );
}

function PromptBox({onSubmit,placeholder="Ask anything...",className=""}) {
  const [val,setVal]=useState("");
  const go=()=>{onSubmit(val.trim()||null);setVal("");};
  return (
    <div className={`flex items-end gap-2 bg-stone-900/80 border border-stone-700/50 rounded-2xl px-5 py-3 focus-within:border-amber-400/40 transition-all duration-300 shadow-lg shadow-black/20 ${className}`}>
      <textarea value={val} onChange={e=>setVal(e.target.value)} placeholder={placeholder} rows={1} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();go();}}} className="flex-1 bg-transparent text-stone-200 placeholder-stone-600 text-base resize-none outline-none py-1" style={{fontFamily:"'Georgia',serif",minHeight:"28px",maxHeight:"100px"}} onInput={e=>{e.target.style.height="28px";e.target.style.height=Math.min(e.target.scrollHeight,100)+"px";}}/>
      <button onClick={go} className="flex-shrink-0 p-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 hover:border-amber-400/50 text-amber-300 transition-all duration-300"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg></button>
    </div>
  );
}

// ============================================================
// PAGES
// ============================================================
function HomePage({navigate,startChat,t}) {
  const questions = getQuestions(t);
  const [vis,setVis]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),100);},[]);
  return (
    <div className={`transition-opacity duration-700 ${vis?"opacity-100":"opacity-0"}`}>
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-14">
        <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse 60% 40% at 50% 40%, rgba(217,169,99,0.06) 0%, transparent 70%)"}}/>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="text-amber-400/80 tracking-widest uppercase text-xs font-medium">{t.hero.tag}</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mt-6 mb-6" style={{fontFamily:"'Georgia',serif"}}>{t.hero.title.split("\n").map((line,i)=><span key={i}>{i>0&&<br/>}{line}</span>)}</h1>
          <p className="text-stone-400 text-lg md:text-xl leading-relaxed mb-3 max-w-lg mx-auto" style={{fontFamily:"'Georgia',serif"}}>{t.hero.sub}</p>
          <p className="text-stone-500 text-base md:text-lg mb-10 max-w-lg mx-auto" style={{fontFamily:"'Georgia',serif"}}>{t.hero.sub2}</p>
          <div className="max-w-lg mx-auto"><PromptBox onSubmit={msg=>startChat(msg)} placeholder={t.prompt.ask}/><p className="mt-4 text-stone-600 text-sm">{t.hero.free}</p></div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-700 text-xs flex flex-col items-center gap-1"><span>{t.hero.scroll}</span><svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7"/></svg></div>
      </div>
      <div className="px-6 py-24 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-light mb-4 text-stone-300" style={{fontFamily:"'Georgia',serif"}}>{t.home.qTitle}</h2>
        <p className="text-stone-500 text-sm mb-10">{t.home.qSub}</p>
        <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
          {questions.slice(0,8).map(q=><button key={q.slug} onClick={()=>startChat(q.question)} className="text-left text-stone-500 hover:text-amber-300 text-sm py-2.5 border-b border-stone-900/50 hover:border-amber-400/20 transition-colors" style={{fontFamily:"'Georgia',serif"}}>{q.question}</button>)}
        </div>
        <button onClick={()=>navigate("/questions")} className="mt-8 text-amber-400/60 hover:text-amber-300 text-sm transition-colors" style={{fontFamily:"'Georgia',serif"}}>{t.home.seeAll}</button>
      </div>
      <div className="px-6 py-24 max-w-3xl mx-auto border-t border-stone-900">
        <h2 className="text-2xl md:text-3xl font-light mb-8 text-stone-300" style={{fontFamily:"'Georgia',serif"}}>{t.home.place}</h2>
        <div className="space-y-6 text-stone-400 leading-relaxed" style={{fontFamily:"'Georgia',serif"}}>
          <p>{t.home.p1}</p>
          <p>{t.home.p2}</p>
          <p>{t.home.p3}</p>
        </div>
      </div>
      <div className="px-6 py-16 border-t border-stone-900"><div className="max-w-3xl mx-auto text-center"><div className="inline-flex items-center gap-3 bg-amber-400/5 border border-amber-400/15 rounded-2xl px-8 py-5"><div className="text-left"><p className="text-stone-200 text-sm font-medium" style={{fontFamily:"'Georgia',serif"}}>{t.home.noCatch}</p><p className="text-stone-500 text-xs mt-0.5">{t.home.noCatchSub}</p></div></div></div></div>
      <div className="px-6 py-24 text-center border-t border-stone-900">
        <p className="text-stone-500 text-lg mb-8 italic" style={{fontFamily:"'Georgia',serif"}}>{t.home.seekQ}</p>
        <div className="max-w-lg mx-auto"><PromptBox onSubmit={msg=>startChat(msg)} placeholder={t.prompt.mind}/></div>
      </div>
      <Footer navigate={navigate} t={t}/>
    </div>
  );
}

function QuestionsPage({navigate,startChat,t}) {
  const questions = getQuestions(t);
  return (<div className="pt-14"><div className="px-6 py-24 max-w-3xl mx-auto">
    <h1 className="text-3xl md:text-5xl font-light mb-4 text-stone-200" style={{fontFamily:"'Georgia',serif"}}>{t.q.title}</h1>
    <p className="text-stone-500 text-base mb-12" style={{fontFamily:"'Georgia',serif"}}>{t.q.sub}</p>
    <div className="space-y-3">{questions.map(q=>(<div key={q.slug} className="flex items-center justify-between border-b border-stone-900/50 py-4 group"><button onClick={()=>navigate(`/questions/${q.slug}`)} className="text-left text-stone-400 group-hover:text-stone-200 text-base transition-colors flex-1" style={{fontFamily:"'Georgia',serif"}}>{q.question}</button><button onClick={()=>startChat(q.question)} className="text-xs text-amber-400/50 hover:text-amber-300 ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all">{t.q.talk}</button></div>))}</div>
  </div><Footer navigate={navigate} t={t}/></div>);
}

function QuestionPage({slug,navigate,startChat,t}) {
  const questions = getQuestions(t);
  const q=questions.find(q=>q.slug===slug);
  if(!q)return <div className="pt-20 text-center text-stone-500">{t.q.notFound} <button onClick={()=>navigate("/questions")} className="underline">{t.q.browse}</button></div>;
  return (<div className="pt-14"><div className="px-6 py-24 max-w-2xl mx-auto">
    <button onClick={()=>navigate("/questions")} className="text-stone-600 hover:text-stone-400 text-xs mb-8 block">{t.q.back}</button>
    <h1 className="text-3xl md:text-5xl font-light mb-8 text-stone-200" style={{fontFamily:"'Georgia',serif"}}>{q.question}</h1>
    <p className="text-stone-400 leading-relaxed text-lg mb-12" style={{fontFamily:"'Georgia',serif"}}>{q.intro}</p>
    <div className="max-w-lg"><p className="text-stone-500 text-sm mb-3" style={{fontFamily:"'Georgia',serif"}}>{t.q.explore}</p><PromptBox onSubmit={msg=>startChat(msg||q.question)} placeholder={t.prompt.type}/><p className="mt-3 text-stone-700 text-xs">{t.q.fpn}</p></div>
  </div>
  <div className="px-6 py-16 border-t border-stone-900 max-w-2xl mx-auto"><h3 className="text-stone-500 text-sm mb-6">{t.q.also}</h3>{questions.filter(r=>r.slug!==slug).slice(0,4).map(r=><button key={r.slug} onClick={()=>{navigate(`/questions/${r.slug}`);window.scrollTo(0,0);}} className="block text-stone-500 hover:text-amber-300 text-sm py-2 transition-colors" style={{fontFamily:"'Georgia',serif"}}>{r.question}</button>)}</div>
  <Footer navigate={navigate} t={t}/></div>);
}

function HowItWorksPage({navigate,startChat,t}) {
  const steps=[{n:"01",t:t.hw.s1t,b:t.hw.s1b},{n:"02",t:t.hw.s2t,b:t.hw.s2b},{n:"03",t:t.hw.s3t,b:t.hw.s3b}];
  return (<div className="pt-14"><div className="px-6 py-24 max-w-3xl mx-auto">
    <h1 className="text-3xl md:text-5xl font-light mb-8 text-stone-200" style={{fontFamily:"'Georgia',serif"}}>{t.hw.t}</h1>
    <div className="space-y-12">{steps.map(s=>(<div key={s.n} className="flex gap-6"><span className="text-amber-400/30 text-sm font-mono mt-1 flex-shrink-0">{s.n}</span><div><h3 className="text-stone-200 text-lg mb-2" style={{fontFamily:"'Georgia',serif"}}>{s.t}</h3><p className="text-stone-500 text-sm leading-relaxed" style={{fontFamily:"'Georgia',serif"}}>{s.b}</p></div></div>))}</div>
    <div className="mt-16 max-w-lg"><PromptBox onSubmit={msg=>startChat(msg)} placeholder={t.prompt.tryit}/></div>
  </div><Footer navigate={navigate} t={t}/></div>);
}

function AboutPage({navigate,startChat,t}) {
  return (<div className="pt-14"><div className="px-6 py-24 max-w-3xl mx-auto">
    <h1 className="text-3xl md:text-5xl font-light mb-8 text-stone-200" style={{fontFamily:"'Georgia',serif"}}>{t.nav.about}</h1>
    <div className="space-y-6 text-stone-400 leading-relaxed" style={{fontFamily:"'Georgia',serif"}}>
      <p className="text-stone-300 text-xl">{t.ab.hero}</p>
      <p>{t.ab.p1}</p>
      <p>{t.ab.p2}</p>
      <p>{t.ab.p3}</p>

      <div className="bg-stone-900/50 border border-stone-800/30 rounded-2xl p-6 my-8 space-y-4">
        <div className="flex gap-3"><span className="text-amber-400/60 mt-0.5 flex-shrink-0">&#10022;</span><div><p className="text-stone-300 text-sm font-medium">{t.ab.b1t}</p><p className="text-stone-500 text-xs mt-1">{t.ab.b1b}</p></div></div>
        <div className="flex gap-3"><span className="text-amber-400/60 mt-0.5 flex-shrink-0">&#10022;</span><div><p className="text-stone-300 text-sm font-medium">{t.ab.b2t}</p><p className="text-stone-500 text-xs mt-1">{t.ab.b2b}</p></div></div>
        <div className="flex gap-3"><span className="text-amber-400/60 mt-0.5 flex-shrink-0">&#10022;</span><div><p className="text-stone-300 text-sm font-medium">{t.ab.b3t}</p><p className="text-stone-500 text-xs mt-1">{t.ab.b3b}</p></div></div>
        <div className="flex gap-3"><span className="text-amber-400/60 mt-0.5 flex-shrink-0">&#10022;</span><div><p className="text-stone-300 text-sm font-medium">{t.ab.b4t}</p><p className="text-stone-500 text-xs mt-1">{t.ab.b4b}</p></div></div>
      </div>
    </div>
    <div className="mt-16 max-w-lg"><PromptBox onSubmit={msg=>startChat(msg)} placeholder={t.prompt.haveQ}/></div>
  </div><Footer navigate={navigate} t={t}/></div>);
}

function PrivacyPage({navigate,t}) {
  return (<div className="pt-14"><div className="px-6 py-24 max-w-3xl mx-auto">
    <h1 className="text-3xl md:text-5xl font-light mb-8 text-stone-200" style={{fontFamily:"'Georgia',serif"}}>{t.pv.title}</h1>
    <div className="space-y-6 text-stone-400 leading-relaxed" style={{fontFamily:"'Georgia',serif"}}>
      <p className="text-stone-300 text-xl">{t.pv.hero}</p>
      <p>{t.pv.p1}</p>
      <p>{t.pv.p2}</p>
      <p>{t.pv.p3}</p>
    </div>
  </div><Footer navigate={navigate} t={t}/></div>);
}

// ============================================================
// CHAT
// ============================================================
function ChatInterface({conversations,setConversations,activeId,setActiveId,navigate,pendingMessage,clearPending,t,lang}) {
  const [input,setInput]=useState("");
  const [isLoading,setIsLoading]=useState(false);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const endRef=useRef(null);
  const inputRef=useRef(null);
  const pendingDone=useRef(false);
  const convo=conversations.find(c=>c.id===activeId);
  const messages=convo?.messages||[];

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  useEffect(()=>{if(!isLoading)inputRef.current?.focus();},[isLoading,activeId]);
  useEffect(()=>{if(pendingMessage&&!pendingDone.current&&activeId){pendingDone.current=true;setTimeout(()=>{send(pendingMessage);clearPending();},300);}},[pendingMessage,activeId]);

  const langName = LANGS[lang]?.name || "English";

  const send=async(text)=>{
    if(!text?.trim()||isLoading)return;
    const userMsg={role:"user",content:text.trim()};
    let c=conversations.find(c=>c.id===activeId)||{id:activeId||generateId(),title:text.trim().slice(0,60),messages:[],createdAt:Date.now(),updatedAt:Date.now()};
    const msgs=[...c.messages,userMsg];
    const title=c.messages.length===0?text.trim().slice(0,60):c.title;
    const up={...c,messages:msgs,title,updatedAt:Date.now()};
    const list=[up,...conversations.filter(c=>c.id!==up.id)];
    setConversations(list);save(STORAGE_KEY,list);setActiveId(up.id);saveId(up.id);setInput("");setIsLoading(true);

    try{
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lang,langName,messages:msgs.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();
      let reply=data.content?.map(b=>b.text||"").join("")||"I'm here. Could you try that again?";
      const showConnect=reply.includes("[SHOW_CONNECT]");
      reply=reply.replace(/\[SHOW_CONNECT\]/g,"").trim();
      const aMsg={role:"assistant",content:reply,showConnect};
      const fin={...up,messages:[...msgs,aMsg],updatedAt:Date.now()};
      const fl=list.map(c=>c.id===fin.id?fin:c);
      setConversations(fl);save(STORAGE_KEY,fl);
    }catch{
      const fin={...up,messages:[...msgs,{role:"assistant",content:"I'm sorry — something went wrong. Please try again."}],updatedAt:Date.now()};
      const fl=list.map(c=>c.id===fin.id?fin:c);setConversations(fl);save(STORAGE_KEY,fl);
    }
    setIsLoading(false);
  };

  const newChat=()=>{const c={id:generateId(),title:t.chat.new,messages:[],createdAt:Date.now(),updatedAt:Date.now()};const l=[c,...conversations];setConversations(l);save(STORAGE_KEY,l);setActiveId(c.id);saveId(c.id);setSidebarOpen(false);};
  const delChat=(id,e)=>{e.stopPropagation();const l=conversations.filter(c=>c.id!==id);setConversations(l);save(STORAGE_KEY,l);if(activeId===id){const n=l[0]?.id||null;setActiveId(n);saveId(n);}};
  const dismissConnect=(idx)=>{const updated=messages.map((m,i)=>i===idx?{...m,showConnect:false}:m);const up={...convo,messages:updated};const l=conversations.map(c=>c.id===up.id?up:c);setConversations(l);save(STORAGE_KEY,l);};

  const starters = [t.chat.s1, t.chat.s2, t.chat.s3, t.chat.s4, t.chat.s5];

  return (
    <div className="h-screen flex bg-stone-950 text-stone-100">
      {sidebarOpen&&<div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={()=>setSidebarOpen(false)}/>}
      <div className={`fixed md:relative z-30 h-full w-72 bg-stone-950 border-r border-stone-800/50 flex flex-col transition-transform duration-200 ${sidebarOpen?"translate-x-0":"-translate-x-full md:translate-x-0"}`}>
        <div className="p-3 flex items-center justify-between border-b border-stone-800/50">
          <button onClick={()=>navigate("/")} className="text-stone-500 hover:text-stone-300 text-xs uppercase">{t.chat.homeBtn}</button>
          <button onClick={newChat} className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg">{t.chat.newBtn}</button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {conversations.length===0&&<p className="text-stone-700 text-xs text-center mt-8 px-4">{t.chat.none}</p>}
          {conversations.map(c=>(<div key={c.id} onClick={()=>{setActiveId(c.id);saveId(c.id);setSidebarOpen(false);}} className={`group flex items-center justify-between px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-colors ${activeId===c.id?"bg-stone-800/80 text-stone-100":"text-stone-500 hover:bg-stone-900"}`}><span className="text-sm truncate flex-1 mr-2">{c.title}</span><button onClick={e=>delChat(c.id,e)} className="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-red-400 text-xs flex-shrink-0">&times;</button></div>))}
        </div>
        <div className="p-3 border-t border-stone-800/50 text-center"><p className="text-stone-700 text-xs">{t.chat.saved}</p></div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800/50">
          <button onClick={()=>setSidebarOpen(true)} className="md:hidden text-stone-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"/></svg></button>
          <span className="flex-1 text-center text-stone-500 text-sm" style={{fontFamily:"'Georgia',serif"}}>{convo?.title||t.chat.new}</span>
          <div className="w-5"/>
        </div>
        <div className="flex-1 overflow-y-auto">
          {messages.length===0&&!isLoading&&(
            <div className="h-full flex flex-col items-center justify-center px-6 text-center"><div className="max-w-md">
              <p className="text-stone-400 text-xl mb-2" style={{fontFamily:"'Georgia',serif"}}>{t.prompt.mind}</p>
              <p className="text-stone-600 text-sm mb-8">{t.chat.about}</p>
              <div className="flex flex-wrap justify-center gap-2">{starters.map(q=><button key={q} onClick={()=>send(q)} className="text-xs text-stone-500 hover:text-amber-300 border border-stone-800 hover:border-amber-400/30 rounded-full px-3 py-1.5 transition-colors" style={{fontFamily:"'Georgia',serif"}}>{q}</button>)}</div>
            </div></div>
          )}
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
            {messages.map((m,i)=>(
              <div key={i}>
                <div className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                  <div className={`max-w-prose rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role==="user"?"bg-stone-800 text-stone-200 rounded-br-md":"bg-stone-900/50 text-stone-300 rounded-bl-md border border-stone-800/30"}`} style={{fontFamily:"'Georgia',serif",whiteSpace:"pre-wrap"}}>{m.content}</div>
                </div>
                {m.showConnect&&<div className="flex justify-start mt-2"><ConnectForm onClose={()=>dismissConnect(i)} t={t}/></div>}
              </div>
            ))}
            {isLoading&&<div className="flex justify-start"><div className="bg-stone-900/50 border border-stone-800/30 rounded-2xl rounded-bl-md px-4 py-3"><div className="flex gap-1.5"><div className="w-1.5 h-1.5 bg-amber-400/40 rounded-full animate-pulse"/><div className="w-1.5 h-1.5 bg-amber-400/40 rounded-full animate-pulse" style={{animationDelay:"200ms"}}/><div className="w-1.5 h-1.5 bg-amber-400/40 rounded-full animate-pulse" style={{animationDelay:"400ms"}}/></div></div></div>}
            <div ref={endRef}/>
          </div>
        </div>
        <div className="border-t border-stone-800/50 px-4 py-3"><div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 focus-within:border-amber-400/30 transition-colors">
            <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(input);}}} placeholder={t.prompt.ask} disabled={isLoading} rows={1} className="flex-1 bg-transparent text-stone-200 placeholder-stone-600 text-sm resize-none outline-none py-1.5" style={{fontFamily:"'Georgia',serif",minHeight:"24px",maxHeight:"120px"}} onInput={e=>{e.target.style.height="24px";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}}/>
            <button onClick={()=>send(input)} disabled={!input.trim()||isLoading} className="flex-shrink-0 p-1.5 rounded-lg text-stone-500 hover:text-amber-400 disabled:text-stone-700 transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg></button>
          </div>
          <p className="text-stone-700 text-xs text-center mt-2">{t.chat.footer}<button onClick={()=>navigate("/privacy")} className="underline hover:text-stone-500">{t.chat.privacy}</button></p>
        </div></div>
      </div>
    </div>
  );
}

// ============================================================
// ROUTER
// ============================================================
export default function App() {
  const [route,setRoute]=useState(window.location.hash.slice(1)||"/");
  const [conversations,setConversations]=useState(load(STORAGE_KEY,[]));
  const [activeId,setActiveId]=useState(()=>{try{return localStorage.getItem(ACTIVE_KEY)}catch{return null}});
  const [pending,setPending]=useState(null);
  const [lang,setLangState]=useState(detectLanguage);

  const t = LANGS[lang] || LANGS.en;
  const isRtl = RTL_LANGS.includes(lang);

  const setLang = (code) => {
    setLangState(code);
    try { localStorage.setItem(LANG_KEY, code); } catch {}
  };

  useEffect(()=>{
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  },[lang, isRtl]);

  useEffect(()=>{const h=()=>setRoute(window.location.hash.slice(1)||"/");window.addEventListener("hashchange",h);return()=>window.removeEventListener("hashchange",h);},[]);

  const navigate=p=>{window.location.hash=p;window.scrollTo(0,0);};
  const startChat=(msg=null)=>{const c={id:generateId(),title:msg?msg.slice(0,60):t.chat.new,messages:[],createdAt:Date.now(),updatedAt:Date.now()};const l=[c,...conversations];setConversations(l);save(STORAGE_KEY,l);setActiveId(c.id);saveId(c.id);if(msg)setPending(msg);navigate("/chat");};

  if(route==="/chat")return <ChatInterface conversations={conversations} setConversations={setConversations} activeId={activeId} setActiveId={setActiveId} navigate={navigate} pendingMessage={pending} clearPending={()=>setPending(null)} t={t} lang={lang}/>;

  const p={navigate,startChat,t};
  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen">
      <Nav navigate={navigate} current={route} t={t} lang={lang} setLang={setLang}/>
      {route==="/"&&<HomePage {...p}/>}
      {route==="/questions"&&<QuestionsPage {...p}/>}
      {route.startsWith("/questions/")&&<QuestionPage slug={route.replace("/questions/","")} {...p}/>}
      {route==="/how-it-works"&&<HowItWorksPage {...p}/>}
      {route==="/about"&&<AboutPage {...p}/>}
      {route==="/privacy"&&<PrivacyPage navigate={navigate} t={t}/>}
    </div>
  );
}
