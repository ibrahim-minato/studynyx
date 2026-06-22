import { useEffect, useState } from "react";
import { TrendingUp, Award, Target, Flame } from "lucide-react";
import api from "../../api";

export default function Progress() {
  const [stats, setStats] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    api.get("/users/stats").then(r => setStats(r.data)).catch(() => {});
    api.get("/ai/quizzes").then(r => setQuizzes(r.data.quizzes?.filter(q => q.completed) || [])).catch(() => {});
  }, []);

  const bars = [
    { l: "Flashcard Mastery", v: 68, col: "#7C3AED" },
    { l: "Quiz Performance", v: stats?.avgQuizScore ?? 0, col: "#10B981" },
    { l: "Study Consistency", v: Math.min((stats?.streak ?? 0) * 10, 100), col: "#F59E0B" },
    { l: "Documents Processed", v: stats?.documents > 0 ? 100 : 0, col: "#06B6D4" },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Progress</h2>
      <p style={{ color: "#5E7094", fontSize: 13, marginBottom: 24 }}>Track your study performance and learning momentum.</p>

      {/* Stat highlights */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 13, marginBottom: 24 }}>
        {[
          { ic: <Flame size={18} color="#F59E0B" />, bg: "rgba(245,158,11,0.1)", l: "Study Streak", v: `${stats?.streak ?? 0} days` },
          { ic: <Target size={18} color="#10B981" />, bg: "rgba(16,185,129,0.1)", l: "Avg Quiz Score", v: `${stats?.avgQuizScore ?? 0}%` },
          { ic: <Award size={18} color="#7C3AED" />, bg: "rgba(124,58,237,0.14)", l: "Quizzes Done", v: stats?.quizzesCompleted ?? 0 },
          { ic: <TrendingUp size={18} color="#06B6D4" />, bg: "rgba(6,182,212,0.1)", l: "Flashcards", v: stats?.totalFlashcards ?? 0 },
        ].map((s,i) => (
          <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.ic}</div>
            <div>
              <div style={{ fontSize: 11, color: "#5E7094", marginBottom: 3 }}>{s.l}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{s.v}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Mastery bars */}
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Skill Mastery</div>
          {bars.map((b,i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: "#94A3B8" }}>{b.l}</span>
                <span style={{ fontWeight: 600 }}>{b.v}%</span>
              </div>
              <div className="pbar">
                <div className="pbar-fill" style={{ width: `${b.v}%`, background: `linear-gradient(90deg,${b.col},${b.col}88)` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent quiz scores */}
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Recent Quiz Results</div>
          {quizzes.length === 0 ? (
            <div style={{ color: "#5E7094", fontSize: 13, textAlign: "center", padding: "28px 0" }}>
              No quizzes completed yet.<br />
              <span style={{ fontSize: 12 }}>Take a quiz to see your scores here.</span>
            </div>
          ) : quizzes.slice(0, 6).map((q, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: q.score >= 80 ? "rgba(16,185,129,0.1)" : q.score >= 60 ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: q.score >= 80 ? "#10B981" : q.score >= 60 ? "#F59E0B" : "#F87171", flexShrink: 0 }}>{q.score}%</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{q.title}</div>
                <div style={{ fontSize: 11, color: "#5E7094" }}>{new Date(q.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak calendar placeholder */}
      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Study Activity — Last 28 Days</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(28, 1fr)", gap: 4 }}>
          {Array.from({ length: 28 }, (_, i) => {
            const intensity = Math.random();
            const bg = intensity > 0.7 ? "#7C3AED" : intensity > 0.4 ? "rgba(124,58,237,0.4)" : intensity > 0.1 ? "rgba(124,58,237,0.15)" : "#111826";
            return <div key={i} title={`Day ${i + 1}`} style={{ width: "100%", paddingBottom: "100%", background: bg, borderRadius: 3 }} />;
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 11, color: "#5E7094" }}>
          <span>Less</span>
          {["#111826","rgba(124,58,237,0.15)","rgba(124,58,237,0.4)","#7C3AED"].map((c,i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
