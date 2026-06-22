import { useState } from "react";
import { Calendar, Plus, Clock, Trash2 } from "lucide-react";

const COLORS = ["#7C3AED","#10B981","#F59E0B","#06B6D4","#EC4899"];
const SUBJECTS = ["Mathematics","Biology","Chemistry","Physics","History","Literature","Programming","Economics","Other"];

export default function StudyPlan() {
  const [sessions, setSessions] = useState([
    { id: 1, subject: "Cell Biology", date: "2025-07-01", time: "09:00", duration: 60, color: "#7C3AED", goal: "Review Chapter 4 — Cell Structure" },
    { id: 2, subject: "Calculus", date: "2025-07-02", time: "14:00", duration: 90, color: "#10B981", goal: "Practice integration problems" },
    { id: 3, subject: "World History", date: "2025-07-03", time: "10:00", duration: 45, color: "#F59E0B", goal: "Summarize Chapter 12" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", date: "", time: "", duration: 60, goal: "", color: COLORS[0] });

  const add = () => {
    if (!form.subject || !form.date) return;
    setSessions(s => [...s, { ...form, id: Date.now() }]);
    setForm({ subject: "", date: "", time: "", duration: 60, goal: "", color: COLORS[0] });
    setShowForm(false);
  };

  const del = (id) => setSessions(s => s.filter(x => x.id !== id));

  const upcoming = sessions.filter(s => new Date(s.date) >= new Date()).sort((a,b) => new Date(a.date) - new Date(b.date));
  const past = sessions.filter(s => new Date(s.date) < new Date());

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Study Plan</h2>
          <p style={{ color: "#5E7094", fontSize: 13 }}>Schedule and track your study sessions</p>
        </div>
        <button className="btn btn-pr btn-sm" onClick={() => setShowForm(f => !f)}>
          <Plus size={14} /> {showForm ? "Cancel" : "Add Session"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>New Study Session</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Subject *</label>
              <select className="inp" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                <option value="">Select subject</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Date *</label>
              <input type="date" className="inp" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Time</label>
              <input type="time" className="inp" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Duration (minutes)</label>
              <select className="inp" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))}>
                {[15,30,45,60,90,120].map(n => <option key={n} value={n}>{n} min</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Study Goal</label>
            <input className="inp" placeholder="What do you want to achieve?" value={form.goal} onChange={e => setForm(p => ({ ...p, goal: e.target.value }))} />
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 8 }}>Color</label>
            <div style={{ display: "flex", gap: 8 }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => setForm(p => ({ ...p, color: c }))} style={{ width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", border: form.color === c ? "2px solid white" : "2px solid transparent", transition: "border 0.15s" }} />
              ))}
            </div>
          </div>
          <button className="btn btn-pr" style={{ marginTop: 16, width: "100%", justifyContent: "center" }} onClick={add}>Add Session</button>
        </div>
      )}

      {upcoming.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#5E7094", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Upcoming</div>
          {upcoming.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 13, padding: 14, background: "#0D1120", border: "1px solid #1A2235", borderRadius: 11, marginBottom: 10 }}>
              <div style={{ width: 46, height: 46, borderRadius: 10, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{new Date(s.date).getDate()}</div>
                <div style={{ fontSize: 9, color: s.color, textTransform: "uppercase" }}>{new Date(s.date).toLocaleString("default", { month: "short" })}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.subject}</div>
                {s.goal && <div style={{ fontSize: 12, color: "#5E7094", marginBottom: 4 }}>{s.goal}</div>}
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "#5E7094" }}>
                  {s.time && <span><Clock size={10} style={{ marginRight: 3 }} />{s.time}</span>}
                  <span>⏱ {s.duration} min</span>
                </div>
              </div>
              <div style={{ width: 4, height: 40, borderRadius: 2, background: s.color, flexShrink: 0 }} />
              <button onClick={() => del(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#374469" }}
                onMouseEnter={e => e.currentTarget.style.color = "#F87171"}
                onMouseLeave={e => e.currentTarget.style.color = "#374469"}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </>
      )}

      {past.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#5E7094", textTransform: "uppercase", letterSpacing: "0.08em", margin: "20px 0 12px" }}>Past Sessions</div>
          {past.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 13, padding: 13, background: "#0D1120", border: "1px solid #1A2235", borderRadius: 11, marginBottom: 8, opacity: 0.6 }}>
              <div style={{ width: 40, height: 40, borderRadius: 9, background: "#111826", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#5E7094" }}>{new Date(s.date).getDate()}</div>
                <div style={{ fontSize: 9, color: "#374469", textTransform: "uppercase" }}>{new Date(s.date).toLocaleString("default", { month: "short" })}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#5E7094" }}>{s.subject}</div>
                <div style={{ fontSize: 11, color: "#374469" }}>✓ Completed · {s.duration} min</div>
              </div>
            </div>
          ))}
        </>
      )}

      {sessions.length === 0 && (
        <div className="empty-state">
          <div className="empty-ic"><Calendar size={22} /></div>
          <h3 style={{ color: "#EDF0FF", fontSize: 17, fontWeight: 600, marginBottom: 8 }}>No sessions planned</h3>
          <p style={{ color: "#5E7094", fontSize: 13, marginBottom: 20 }}>Schedule your first study session to stay on track</p>
          <button className="btn btn-pr btn-sm" onClick={() => setShowForm(true)}><Plus size={14} /> Add Session</button>
        </div>
      )}
    </div>
  );
}
