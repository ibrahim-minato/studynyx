import { useState, useEffect } from "react";
import { HelpCircle, Sparkles, CheckCircle, XCircle, FileText } from "lucide-react";
import api from "../../api";

const LETTERS = ["A", "B", "C", "D"];

export default function Quiz() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [count, setCount] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
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
    if (!text.trim()) return setError("Please paste study material or select a document first.");
    setError(""); setLoading(true); setQuiz(null); setQIndex(0); setSelected(null); setAnswered(false); setScore(0); setDone(false);
    try {
      const res = await api.post("/ai/quiz", { text, title: title || "Practice Quiz", count });
      setQuiz(res.data.quiz);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate quiz.");
    } finally { setLoading(false); }
  };

  const select = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === quiz.questions[qIndex].correct) setScore(s => s + 1);
  };

  const next = () => {
    if (qIndex < quiz.questions.length - 1) {
      setQIndex(i => i + 1); setSelected(null); setAnswered(false);
    } else {
      setDone(true);
      const pct = Math.round((score + (selected === quiz.questions[qIndex].correct ? 1 : 0)) / quiz.questions.length * 100);
      api.patch(`/ai/quiz/${quiz._id}/score`, { score: pct }).catch(() => {});
    }
  };

  const restart = () => { setQIndex(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); };
  const reset = () => { setQuiz(null); setText(""); setTitle(""); setSelectedDoc(""); restart(); };

  const q = quiz?.questions[qIndex];
  const finalScore = Math.round((score / quiz?.questions?.length) * 100);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>AI Quiz Generator</h2>
      <p style={{ color: "#5E7094", fontSize: 13, marginBottom: 24 }}>Select a saved document or paste material to generate a quiz.</p>

      {!quiz && !loading && (
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
              <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Quiz title (optional)</label>
              <input className="inp" placeholder="e.g. Cell Biology Quiz" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Number of questions</label>
              <select className="inp" value={count} onChange={e => setCount(Number(e.target.value))}>
                {[3,5,8,10].map(n => <option key={n} value={n}>{n} questions</option>)}
              </select>
            </div>
          </div>

          <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Or paste material directly *</label>
          <textarea className="inp" style={{ minHeight: 180 }} placeholder="Paste your notes or textbook content here..." value={text} onChange={e => { setText(e.target.value); setSelectedDoc(""); }} />
          {error && <div className="alert-err" style={{ marginTop: 12 }}>{error}</div>}
          <button className="btn btn-pr" style={{ marginTop: 14, width: "100%", justifyContent: "center" }} onClick={generate}>
            <Sparkles size={16} /> Generate {count}-Question Quiz
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ width: 48, height: 48, border: "3px solid rgba(109,40,217,0.2)", borderTopColor: "#7C3AED", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Generating your quiz...</div>
          <div style={{ color: "#5E7094", fontSize: 13 }}>Creating {count} challenging questions</div>
        </div>
      )}

      {done && quiz && (
        <div className="card" style={{ textAlign: "center", padding: "48px 36px" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>{finalScore >= 80 ? "🎉" : finalScore >= 60 ? "👍" : "📚"}</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Quiz Complete!</h2>
          <div style={{ fontSize: 48, fontWeight: 700, color: finalScore >= 80 ? "#10B981" : finalScore >= 60 ? "#F59E0B" : "#F87171", marginBottom: 4 }}>{finalScore}%</div>
          <div style={{ color: "#5E7094", marginBottom: 28 }}>You got {score} out of {quiz.questions.length} correct</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn btn-gh" onClick={restart}>Try Again</button>
            <button className="btn btn-pr" onClick={reset}>New Quiz</button>
          </div>
        </div>
      )}

      {quiz && !done && !loading && q && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: "#5E7094" }}>Question <strong style={{ color: "#EDF0FF" }}>{qIndex + 1}</strong> of {quiz.questions.length}</div>
            <button className="btn btn-gh btn-xs" onClick={reset}>Exit Quiz</button>
          </div>

          <div className="pbar" style={{ marginBottom: 24 }}>
            <div className="pbar-fill" style={{ width: `${(qIndex / quiz.questions.length) * 100}%` }} />
          </div>

          <div className="card" style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(109,40,217,0.14)", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 700 }}>{qIndex + 1}</div>
              <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}>{q.question}</div>
            </div>
            {q.options.map((opt, i) => {
              let cls = "qz-opt";
              if (answered) {
                cls += " disabled";
                if (i === q.correct) cls += " correct";
                else if (i === selected) cls += " wrong";
              }
              return (
                <div key={i} className={cls} onClick={() => select(i)}>
                  <div className="opt-letter">{LETTERS[i]}</div>
                  <span>{opt.replace(/^[A-D]\)\s*/, "")}</span>
                  {answered && i === q.correct && <CheckCircle size={15} color="#10B981" style={{ marginLeft: "auto" }} />}
                  {answered && i === selected && i !== q.correct && <XCircle size={15} color="#EF4444" style={{ marginLeft: "auto" }} />}
                </div>
              );
            })}
          </div>

          {answered && (
            <div style={{ background: "rgba(109,40,217,0.08)", border: "1px solid rgba(109,40,217,0.2)", borderRadius: 11, padding: "13px 16px", marginBottom: 18, animation: "fadeIn 0.3s ease" }}>
              <div style={{ fontSize: 12, color: "#A78BFA", fontWeight: 700, marginBottom: 5 }}>EXPLANATION</div>
              <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{q.explanation}</div>
            </div>
          )}

          {answered && (
            <button className="btn btn-pr" style={{ width: "100%", justifyContent: "center" }} onClick={next}>
              {qIndex < quiz.questions.length - 1 ? "Next Question →" : "See Results"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
