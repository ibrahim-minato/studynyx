import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Brain, HelpCircle, MessageSquare, Plus, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";

export default function Overview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    api.get("/users/stats").then((r) => setStats(r.data)).catch(() => {});
    api.get("/documents").then((r) => setDocs(r.data.documents?.slice(0, 4) || [])).catch(() => {});
  }, []);

  const quickActions = [
    { icon: <FileText size={16} />, col: "#7C3AED", bg: "rgba(124,58,237,0.14)", t: "Upload Document", d: "PDF or text", to: "/dashboard/documents" },
    { icon: <Brain size={16} />, col: "#A78BFA", bg: "rgba(167,139,250,0.1)", t: "Generate Flashcards", d: "From your material", to: "/dashboard/flashcards" },
    { icon: <HelpCircle size={16} />, col: "#F59E0B", bg: "rgba(245,158,11,0.1)", t: "Start a Quiz", d: "Test your knowledge", to: "/dashboard/quiz" },
    { icon: <MessageSquare size={16} />, col: "#10B981", bg: "rgba(16,185,129,0.1)", t: "Ask AI Tutor", d: "Get instant help", to: "/dashboard/tutor" },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>

      {/* Welcome banner */}
      <div style={{ background: "linear-gradient(135deg,rgba(109,40,217,0.13),rgba(139,92,246,0.04))", border: "1px solid rgba(109,40,217,0.2)", borderRadius: 14, padding: "18px 20px", marginBottom: 16, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user?.name?.split(" ")[0]} 👋
          </div>
          <div style={{ color: "#5E7094", fontSize: 13 }}>
            {stats ? `${stats.documents} documents · ${stats.totalFlashcards} flashcards` : "Loading your stats..."}
          </div>
        </div>
        <Link to="/dashboard/documents" className="btn btn-pr btn-sm"><Plus size={14} /> Upload</Link>
      </div>

      {/* Stats row — 2 cols on mobile, 4 on desktop */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }} className="stats-row-grid">
        {[
          { l: "Documents", v: stats?.documents ?? "—", c: "Uploaded" },
          { l: "Flashcards", v: stats?.totalFlashcards ?? "—", c: "Generated" },
          { l: "Avg Quiz Score", v: stats ? `${stats.avgQuizScore}%` : "—", c: `${stats?.quizzesCompleted ?? 0} quizzes` },
          { l: "Study Streak", v: `🔥 ${stats?.streak ?? 0}`, c: "days in a row" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "#5E7094", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 3 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: "#10B981" }}>{s.c}</div>
          </div>
        ))}
      </div>

      {/* Recent Documents */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #1A2235", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Recent Documents</span>
          <Link to="/dashboard/documents" style={{ fontSize: 12, color: "#A78BFA", textDecoration: "none" }}>View all →</Link>
        </div>
        {docs.length === 0 ? (
          <div style={{ padding: "24px 16px", textAlign: "center", color: "#5E7094", fontSize: 13 }}>
            No documents yet. <Link to="/dashboard/documents" style={{ color: "#A78BFA", textDecoration: "none" }}>Upload one →</Link>
          </div>
        ) : docs.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderBottom: i < docs.length - 1 ? "1px solid #0A0E1A" : "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(124,58,237,0.14)", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileText size={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.title}</div>
              <div style={{ fontSize: 11, color: "#5E7094" }}>{d.fileType.toUpperCase()} · {new Date(d.createdAt).toLocaleDateString()}</div>
            </div>
            <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 100, fontWeight: 600, background: "rgba(16,185,129,0.1)", color: "#10B981", flexShrink: 0 }}>Ready</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #1A2235" }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Quick Actions</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 12 }}>
          {quickActions.map((a, i) => (
            <Link key={i} to={a.to} style={{ background: "#111826", border: "1px solid #1A2235", borderRadius: 10, padding: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1A2235"; }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: a.bg, color: a.col, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{a.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#EDF0FF", marginBottom: 2 }}>{a.t}</div>
                <div style={{ fontSize: 11, color: "#5E7094" }}>{a.d}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Progress — hidden on mobile via CSS */}
      <div className="card progress-overview-panel">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={16} color="#7C3AED" /> Progress Overview
        </div>
        {[
          { l: "Flashcard Mastery", v: 68, col: "#7C3AED" },
          { l: "Quiz Performance", v: stats?.avgQuizScore ?? 0, col: "#10B981" },
          { l: "Study Consistency", v: Math.min((stats?.streak ?? 0) * 10, 100), col: "#F59E0B" },
          { l: "Documents Processed", v: stats?.documents > 0 ? 100 : 0, col: "#06B6D4" },
        ].map((p, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 13 }}>
              <span style={{ color: "#94A3B8" }}>{p.l}</span>
              <span style={{ fontWeight: 600 }}>{p.v}%</span>
            </div>
            <div className="pbar">
              <div className="pbar-fill" style={{ width: `${p.v}%`, background: `linear-gradient(90deg, ${p.col}, ${p.col}88)` }} />
            </div>
          </div>
        ))}
        <Link to="/dashboard/progress" className="btn btn-gh btn-sm btn-full" style={{ marginTop: 4 }}>View Full Progress →</Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-row-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .progress-overview-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
