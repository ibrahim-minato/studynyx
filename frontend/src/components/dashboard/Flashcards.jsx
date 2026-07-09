import { useState, useEffect } from "react";
import { Brain, ChevronLeft, ChevronRight, RotateCcw, Sparkles, FileText } from "lucide-react";
import api from "../../api";

export default function Flashcards() {
  const [text, setText] = useState(() => { const p = sessionStorage.getItem("sn_prefill_text"); if (p) { sessionStorage.removeItem("sn_prefill_text"); return p; } return ""; });
  const [title, setTitle] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [count, setCount] = useState(8);
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");

  useEffect(() => {
    api.get("/documents").then(r => setDocs(r.data.documents || [])).catch(() => {});
  }, []);

  const loadDoc = async (id) => {
    if (!id) { setText(""); setTitle(""); setSelectedDoc(""); return; }
    setSelectedDoc(id);
    try {
      const res = await api.get(`/documents/${id}`);
      setText(res.data.document.content);
      setTitle(res.data.document.title);
    } catch { setError("Failed to load document."); }
  };

  const generate = async () => {
    if (!text.trim()) return setError("Please paste some study material or select a document first.");
    setError(""); setLoading(true); setCards([]); setIndex(0); setFlipped(false);
    try {
      const res = await api.post("/ai/flashcards", { text, title: title || "My Flashcards", count });
      setCards(res.data.flashcardSet.cards);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate flashcards. Try again.");
    } finally { setLoading(false); }
  };

  const prev = () => { setIndex(i => Math.max(0, i - 1)); setFlipped(false); };
  const next = () => { setIndex(i => Math.min(cards.length - 1, i + 1)); setFlipped(false); };
  const reset = () => { setIndex(0); setFlipped(false); };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>AI Flashcards</h2>
      <p style={{ color: "#5E7094", fontSize: 13, marginBottom: 24 }}>Select a saved document or paste material to generate flashcards.</p>

      {cards.length === 0 && (
        <div className="card" style={{ marginBottom: 20 }}>

          {/* Document picker */}
          {docs.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>
                <FileText size={12} style={{ marginRight: 5 }} />
                Use a saved document
              </label>
              <select className="inp" value={selectedDoc} onChange={e => loadDoc(e.target.value)}>
                <option value="">— Select a document —</option>
                {docs.map(d => <option key={d._id} value={d._id}>{d.title}</option>)}
              </select>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Set title (optional)</label>
              <input className="inp" placeholder="e.g. Biology Chapter 4" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Number of cards</label>
              <select className="inp" value={count} onChange={e => setCount(Number(e.target.value))}>
                {[5,8,10,15,20].map(n => <option key={n} value={n}>{n} cards</option>)}
              </select>
            </div>
          </div>

          <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Or paste material directly *</label>
          <textarea className="inp" style={{ minHeight: 180, lineHeight: 1.6 }} placeholder="Paste your notes, textbook content, or any study material here..." value={text} onChange={e => { setText(e.target.value); setSelectedDoc(""); }} />
          {error && <div className="alert-err" style={{ marginTop: 12 }}>{error}</div>}
          <button className="btn btn-pr" style={{ marginTop: 14, width: "100%", justifyContent: "center" }} onClick={generate} disabled={loading}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Generating...</> : <><Sparkles size={16} /> Generate {count} Flashcards</>}
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ width: 48, height: 48, border: "3px solid rgba(109,40,217,0.2)", borderTopColor: "#7C3AED", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Generating your flashcards...</div>
          <div style={{ color: "#5E7094", fontSize: 13 }}>AI is reading your material</div>
        </div>
      )}

      {cards.length > 0 && !loading && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#5E7094" }}>Card <strong style={{ color: "#EDF0FF" }}>{index + 1}</strong> of {cards.length}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-gh btn-sm" onClick={reset}><RotateCcw size={13} /> Reset</button>
              <button className="btn btn-gh btn-sm" onClick={() => { setCards([]); setText(""); setTitle(""); setSelectedDoc(""); }}>New Set</button>
            </div>
          </div>

          <div className="pbar" style={{ marginBottom: 20 }}>
            <div className="pbar-fill" style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
          </div>

          <div className="flip-card" onClick={() => setFlipped(f => !f)}>
            <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
              <div className="flip-face flip-front">
                <div style={{ fontSize: 10, color: "#5E7094", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Question — tap to reveal</div>
                <Brain size={28} color="#7C3AED" style={{ marginBottom: 14 }} />
                <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.4 }}>{cards[index]?.question}</div>
              </div>
              <div className="flip-face flip-back">
                <div style={{ fontSize: 10, color: "#A78BFA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Answer</div>
                <div style={{ fontSize: 16, lineHeight: 1.6, color: "#EDF0FF" }}>{cards[index]?.answer}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
            <button className="btn btn-gh" onClick={prev} disabled={index === 0}><ChevronLeft size={16} /> Previous</button>
            <button className="btn btn-pr" onClick={next} disabled={index === cards.length - 1}>Next <ChevronRight size={16} /></button>
          </div>

          <div className="card" style={{ marginTop: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>All Cards ({cards.length})</div>
            {cards.map((c, i) => (
              <div key={i} onClick={() => { setIndex(i); setFlipped(false); }} style={{ padding: "11px 14px", background: i === index ? "rgba(109,40,217,0.1)" : "#111826", border: `1px solid ${i === index ? "rgba(109,40,217,0.3)" : "#1A2235"}`, borderRadius: 9, marginBottom: 8, cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ fontSize: 12, color: "#A78BFA", marginBottom: 4, fontWeight: 600 }}>Q{i + 1}</div>
                <div style={{ fontSize: 13, color: "#94A3B8" }}>{c.question}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
