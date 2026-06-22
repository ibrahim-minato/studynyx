import { Link } from "react-router-dom";
import { BookOpen, Brain, BarChart3, MessageSquare, FileText, Zap, ChevronRight, Sparkles, Star, Check } from "lucide-react";

const Logo = () => (
  <Link to="/" className="logo">
    <div className="logo-ic"><BookOpen size={16} color="white" /></div>
    <span className="logo-tx">StudyNyx</span>
  </Link>
);

const features = [
  { ic: <FileText size={20} />, col: "#7C3AED", bg: "rgba(124,58,237,0.14)", t: "Smart Summarization", d: "Upload any PDF or document and instantly get layered summaries — brief overviews to in-depth breakdowns." },
  { ic: <Brain size={20} />, col: "#A78BFA", bg: "rgba(167,139,250,0.1)", t: "AI Flashcard Generation", d: "Paste your notes and get a full set of study-ready flashcards generated in seconds. Flip, review, master." },
  { ic: <MessageSquare size={20} />, col: "#10B981", bg: "rgba(16,185,129,0.1)", t: "AI Tutor", d: "Chat with an AI that knows your material. Ask questions, get explanations, request examples — anytime." },
  { ic: <Zap size={20} />, col: "#F59E0B", bg: "rgba(245,158,11,0.1)", t: "Quiz & Question Generator", d: "AI generates MCQ quizzes and practice questions directly from your uploaded content." },
  { ic: <BarChart3 size={20} />, col: "#06B6D4", bg: "rgba(6,182,212,0.1)", t: "Progress Analytics", d: "Track streaks, quiz scores, mastery levels, and study time with a clean visual dashboard." },
  { ic: <BookOpen size={20} />, col: "#EC4899", bg: "rgba(236,72,153,0.1)", t: "Document Library", d: "Upload and organize all your study materials in one place. PDF, TXT, and pasted text all supported." },
];

const comparison = [
  { feat: "AI Flashcard Generation", us: true, sf: true, qz: true },
  { feat: "AI Quiz / Question Generator", us: true, sf: true, qz: true },
  { feat: "AI Tutor (Chat)", us: true, sf: true, qz: false },
  { feat: "Smart Summarization", us: true, sf: true, qz: false },
  { feat: "PDF Upload & Parsing", us: true, sf: true, qz: true },
  { feat: "Progress Analytics", us: true, sf: true, qz: true },
  { feat: "Spaced Repetition", us: "soon", sf: true, qz: true },
  { feat: "Dark Mode UI", us: true, sf: false, qz: false },
  { feat: "Free Plan Available", us: true, sf: true, qz: true },
  { feat: "Pro Price / month", us: "$6.99", sf: "$7.99", qz: "$7.99" },
];

const plans = [
  {
    name: "Free", price: "$0", period: "/month", desc: "Perfect to get started",
    feats: ["3 documents", "20 flashcards/month", "5 quiz questions/month", "Basic AI Tutor", "1 summary/day"],
    cta: "Get Started Free", highlight: false,
  },
  {
    name: "Pro", price: "$6.99", period: "/month", desc: "For serious students",
    feats: ["Unlimited documents", "Unlimited flashcards", "Unlimited quizzes", "Full AI Tutor access", "Instant summaries", "Progress analytics", "Priority support"],
    cta: "Start Pro — $6.99/mo", highlight: true,
  },
  {
    name: "Team", price: "$14.99", period: "/month", desc: "For study groups",
    feats: ["Everything in Pro", "Up to 5 members", "Shared document library", "Group progress tracking", "Team leaderboard", "Admin dashboard"],
    cta: "Start Team Plan", highlight: false,
  },
];

const Cell = ({ val }) => {
  if (val === true) return <span className="tag-yes">✓ Yes</span>;
  if (val === false) return <span className="tag-no">✗ No</span>;
  if (val === "soon") return <span className="tag-soon">Coming soon</span>;
  return <span style={{ color: "#EDF0FF", fontWeight: 600 }}>{val}</span>;
};

export default function Landing() {
  return (
    <div style={{ background: "#060A14", minHeight: "100vh" }}>
      {/* Nav */}
      <nav className="lnav">
        <Logo />
        <div className="nav-links" style={{ display: "flex", gap: 28 }}>
          {["Features", "Compare", "Pricing"].map(l => <a key={l} href={`#${l.toLowerCase()}`} className="nl">{l}</a>)}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/login" className="btn btn-gh btn-sm">Log in</Link>
          <Link to="/register" className="btn btn-pr btn-sm">Get Started <ChevronRight size={14} /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 52px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(109,40,217,0.22) 0%, transparent 68%), radial-gradient(ellipse 40% 40% at 80% 65%, rgba(139,92,246,0.06) 0%, transparent 60%)" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1, alignItems: "center" }}>
          <div className="fu">
            <div className="badge" style={{ marginBottom: 22 }}><Sparkles size={12} /> AI-powered study companion</div>
            <h1 style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 18 }}>
              Turn Any Material Into<br />
              <span style={{ background: "linear-gradient(135deg,#7C3AED,#A78BFA,#C4B5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                A Study Session
              </span>
            </h1>
            <p style={{ fontSize: 17, color: "#5E7094", lineHeight: 1.65, marginBottom: 32, maxWidth: 460 }}>
              Upload a PDF, paste your notes, or start a chat — StudyNyx generates flashcards, quizzes, summaries, and a personal AI tutor instantly.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/register" className="btn btn-pr"><Zap size={15} /> Start for Free</Link>
              <Link to="/login" className="btn btn-gh">Log in</Link>
            </div>
            <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex" }}>
                {["M","A","K","S","J"].map((l,i) => (
                  <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid #060A14", marginLeft: i === 0 ? 0 : -8, background: `linear-gradient(135deg, #6D28D9, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white" }}>{l}</div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: 2 }}>{[...Array(5)].map((_,i) => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}</div>
                <div style={{ fontSize: 12, color: "#5E7094", marginTop: 2 }}>Loved by 12,000+ students</div>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="fu2" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
            <div style={{ position: "absolute", top: 20, left: 20, width: 210, background: "#0D1120", border: "1px solid #1A2235", borderRadius: 13, padding: "14px 18px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", animation: "float1 4s ease-in-out infinite" }}>
              <div style={{ fontSize: 10, color: "#7C3AED", fontWeight: 700, marginBottom: 7 }}>FLASHCARD</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 5 }}>What is photosynthesis?</div>
              <div style={{ fontSize: 11, color: "#5E7094" }}>Process by which plants convert sunlight into chemical energy...</div>
            </div>
            <div style={{ position: "absolute", top: 110, right: 10, width: 195, background: "#0D1120", border: "1px solid #1A2235", borderRadius: 13, padding: "14px 18px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", animation: "float2 5s ease-in-out infinite" }}>
              <div style={{ fontSize: 10, color: "#10B981", fontWeight: 700, marginBottom: 7 }}>QUIZ SCORE</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#10B981" }}>92%</div>
              <div style={{ fontSize: 11, color: "#5E7094" }}>Chapter 4 · Cell Biology</div>
            </div>
            <div style={{ position: "absolute", bottom: 40, left: 10, width: 200, background: "#0D1120", border: "1px solid #1A2235", borderRadius: 13, padding: "14px 18px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", animation: "float3 4.5s ease-in-out infinite" }}>
              <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 700, marginBottom: 7 }}>STUDY STREAK</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#F59E0B" }}>🔥 14</span>
                <span style={{ fontSize: 11, color: "#5E7094" }}>days in a row</span>
              </div>
            </div>
            <div style={{ width: 240, height: 170, background: "linear-gradient(135deg,#0D1120,#111826)", border: "1px solid #1E2840", borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, position: "relative", zIndex: 2, boxShadow: "0 0 60px rgba(109,40,217,0.13), 0 30px 70px rgba(0,0,0,0.3)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, background: "linear-gradient(135deg,#6D28D9,#A78BFA)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Brain size={22} color="white" />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>AI Tutor Ready</div>
                <div style={{ fontSize: 11, color: "#5E7094" }}>Ask anything about your material</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: "linear-gradient(135deg,rgba(109,40,217,0.09),rgba(139,92,246,0.04))", borderTop: "1px solid rgba(109,40,217,0.14)", borderBottom: "1px solid rgba(109,40,217,0.14)", padding: "54px 52px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center" }}>
          {[["12,000+","Active Students"],["500K+","Flashcards Generated"],["98%","Satisfaction Rate"],["3×","Faster Learning"]].map(([n,l],i) => (
            <div key={i} style={{ padding: "0 32px", borderRight: i < 3 ? "1px solid #1A2235" : "none" }}>
              <div style={{ fontSize: 38, fontWeight: 700, color: "#A78BFA", marginBottom: 5 }}>{n}</div>
              <div style={{ color: "#5E7094", fontSize: 14 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" style={{ maxWidth: 1200, margin: "0 auto", padding: "88px 52px" }}>
        <div style={{ color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Features</div>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 14, letterSpacing: "-0.02em" }}>Everything you need to ace your studies</h2>
        <p style={{ color: "#5E7094", fontSize: 16, lineHeight: 1.65, maxWidth: 500 }}>From summarizing dense textbooks to quizzing you on what matters — StudyNyx does the heavy lifting.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 52 }}>
          {features.map((f,i) => (
            <div key={i} className="card card-hover">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: f.bg, color: f.col, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{f.ic}</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 9 }}>{f.t}</div>
              <div style={{ color: "#5E7094", fontSize: 13, lineHeight: 1.6 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ borderTop: "1px solid #1A2235", maxWidth: 1200, margin: "0 auto", padding: "88px 52px" }}>
        <div style={{ color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>How It Works</div>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 52, letterSpacing: "-0.02em" }}>From material to mastery in 3 steps</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
          {[
            { n: "1", t: "Upload Your Material", d: "Drop in a PDF, paste notes, or type directly. StudyNyx extracts and understands your content instantly." },
            { n: "2", t: "AI Generates Everything", d: "Flashcards, summaries, quiz questions, and a personal tutor are created automatically from your content." },
            { n: "3", t: "Study & Track Progress", d: "Study interactively, take quizzes, chat with your AI tutor, and watch your mastery scores climb." },
          ].map((s,i) => (
            <div key={i} style={{ textAlign: "center", padding: "0 16px" }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(109,40,217,0.14)", border: "1px solid rgba(109,40,217,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 19, color: "#A78BFA", margin: "0 auto 18px" }}>{s.n}</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 9 }}>{s.t}</div>
              <div style={{ color: "#5E7094", fontSize: 13, lineHeight: 1.65 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" style={{ borderTop: "1px solid #1A2235", maxWidth: 1200, margin: "0 auto", padding: "88px 52px" }}>
        <div style={{ color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Compare</div>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 14, letterSpacing: "-0.02em" }}>Why StudyNyx?</h2>
        <p style={{ color: "#5E7094", fontSize: 16, lineHeight: 1.65, maxWidth: 480, marginBottom: 40 }}>More features, better price, and a UI built for focus — not distraction.</p>
        <div style={{ background: "#0D1120", border: "1px solid #1A2235", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1A2235" }}>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#5E7094" }}>Feature</th>
                <th style={{ padding: "14px 20px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#A78BFA", background: "rgba(109,40,217,0.08)" }}>StudyNyx ✦</th>
                <th style={{ padding: "14px 20px", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#5E7094" }}>StudyFetch</th>
                <th style={{ padding: "14px 20px", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#5E7094" }}>Quizlet</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row,i) => (
                <tr key={i} style={{ borderBottom: i < comparison.length - 1 ? "1px solid #0A0E1A" : "none" }}>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#94A3B8" }}>{row.feat}</td>
                  <td style={{ padding: "13px 20px", textAlign: "center", background: "rgba(109,40,217,0.04)" }}><Cell val={row.us} /></td>
                  <td style={{ padding: "13px 20px", textAlign: "center" }}><Cell val={row.sf} /></td>
                  <td style={{ padding: "13px 20px", textAlign: "center" }}><Cell val={row.qz} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ borderTop: "1px solid #1A2235", maxWidth: 1200, margin: "0 auto", padding: "88px 52px" }}>
        <div style={{ color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Pricing</div>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 14, letterSpacing: "-0.02em" }}>Simple, transparent pricing</h2>
        <p style={{ color: "#5E7094", fontSize: 16, lineHeight: 1.65, maxWidth: 440, marginBottom: 48 }}>Start free. Upgrade when you're ready. No hidden fees.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {plans.map((p,i) => (
            <div key={i} style={{ background: "#0D1120", border: `1px solid ${p.highlight ? "#7C3AED" : "#1A2235"}`, borderRadius: 16, padding: 28, position: "relative", ...(p.highlight ? { background: "linear-gradient(180deg,rgba(109,40,217,0.1),#0D1120)" } : {}) }}>
              {p.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#6D28D9,#7C3AED)", color: "white", padding: "4px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>Most Popular</div>}
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{p.name}</div>
              <div style={{ color: "#5E7094", fontSize: 13, marginBottom: 16 }}>{p.desc}</div>
              <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 4 }}>{p.price}<span style={{ fontSize: 14, color: "#5E7094", fontWeight: 400 }}>{p.period}</span></div>
              <div style={{ margin: "20px 0" }}>
                {p.feats.map((f,j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#94A3B8", marginBottom: 10 }}>
                    <Check size={14} color="#10B981" style={{ flexShrink: 0 }} />{f}
                  </div>
                ))}
              </div>
              <Link to="/register" className={`btn btn-full btn-sm ${p.highlight ? "btn-pr" : "btn-gh"}`}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 52px 88px" }}>
        <div style={{ background: "linear-gradient(135deg,rgba(109,40,217,0.12),rgba(139,92,246,0.04))", border: "1px solid rgba(109,40,217,0.2)", borderRadius: 22, padding: "64px 48px", textAlign: "center" }}>
          <div className="badge" style={{ margin: "0 auto 18px" }}><Sparkles size={12} /> Start studying smarter today</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 14 }}>Join 12,000+ students already using StudyNyx</h2>
          <p style={{ color: "#5E7094", fontSize: 16, margin: "0 auto 32px", maxWidth: 440 }}>Get started for free — no credit card needed.</p>
          <Link to="/register" className="btn btn-pr" style={{ fontSize: 15, padding: "14px 36px" }}><Zap size={16} /> Get Started Free</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#060A14", borderTop: "1px solid #1A2235", padding: "56px 52px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 44, maxWidth: 1200, margin: "0 auto 44px" }}>
          <div>
            <div className="logo" style={{ marginBottom: 14 }}>
              <div className="logo-ic"><BookOpen size={16} color="white" /></div>
              <span className="logo-tx">StudyNyx</span>
            </div>
            <p style={{ color: "#5E7094", fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>AI-powered study platform that helps students learn faster and remember more.</p>
            <p style={{ color: "#2E3D5C", fontSize: 12, marginTop: 14 }}>Made with ♥ by Nyxon</p>
          </div>
          {[
            { t: "Product", ls: ["Features","Pricing","Changelog","Roadmap"] },
            { t: "Resources", ls: ["Documentation","Blog","Support","Status"] },
            { t: "Company", ls: ["About","Careers","Privacy","Terms"] },
          ].map((c,i) => (
            <div key={i}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#EDF0FF", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.t}</div>
              {c.ls.map(l => <a key={l} href="#" style={{ color: "#5E7094", fontSize: 13, display: "block", marginBottom: 8, textDecoration: "none", transition: "color 0.2s" }}>{l}</a>)}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1A2235", paddingTop: 20, maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ color: "#2E3D5C", fontSize: 12 }}>© 2025 StudyNyx. All rights reserved.</div>
          <div style={{ color: "#2E3D5C", fontSize: 12 }}>Built with React + Node.js</div>
        </div>
      </footer>
    </div>
  );
}
