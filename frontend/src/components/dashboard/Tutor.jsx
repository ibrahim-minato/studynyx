import { useState, useRef, useEffect } from "react";
import { Brain, Send, FileText } from "lucide-react";
import api from "../../api";

export default function Tutor() {
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: "Hi! I'm your StudyNyx AI Tutor 👋\n\nPaste your study material in this chat, or select a saved document above to study it. I can:\n• Explain complex concepts clearly\n• Generate flashcards from your text\n• Quiz you on any topic\n• Break down difficult problems step-by-step" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [context, setContext] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    api.get("/documents").then(r => setDocs(r.data.documents || [])).catch(() => {});
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const loadDoc = async (id) => {
    if (!id) { setSelectedDoc(""); setContext(""); return; }
    setSelectedDoc(id);
    try {
      const res = await api.get(`/documents/${id}`);
      const doc = res.data.document;
      setContext(doc.content);
      setMsgs(prev => [...prev, {
        role: "assistant",
        content: `📄 I've loaded **${doc.title}**. Ask me anything about it — I can explain concepts, generate flashcards, or quiz you on the content!`
      }]);
    } catch { }
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setInput("");
    const next = [...msgs, { role: "user", content: txt }];
    setMsgs(next);
    setLoading(true);
    try {
      const res = await api.post("/ai/tutor", {
        messages: next.map(m => ({ role: m.role, content: m.content })),
        context: context || undefined,
      });
      setMsgs(p => [...p, { role: "assistant", content: res.data.reply }]);
    } catch {
      setMsgs(p => [...p, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const suggestions = [
    "Explain the key concepts in this material",
    "Generate 5 flashcards from this",
    "Quiz me on this topic",
    "Summarize the main points",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>AI Tutor</h2>
        <p style={{ color: "#5E7094", fontSize: 13 }}>Ask anything, or load a document to study it with AI.</p>
      </div>

      {/* Document picker */}
      {docs.length > 0 && (
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <FileText size={14} color="#5E7094" style={{ flexShrink: 0 }} />
          <select className="inp" style={{ maxWidth: 360 }} value={selectedDoc} onChange={e => loadDoc(e.target.value)}>
            <option value="">— Load a saved document —</option>
            {docs.map(d => <option key={d._id} value={d._id}>{d.title}</option>)}
          </select>
          {selectedDoc && (
            <span style={{ fontSize: 12, color: "#10B981", display: "flex", alignItems: "center", gap: 4 }}>
              ✓ Document loaded
            </span>
          )}
        </div>
      )}

      <div className="chat-panel" style={{ flex: 1, minHeight: 0 }}>
        <div className="chat-header">
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6D28D9,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={14} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>StudyNyx AI Tutor</div>
            <div style={{ fontSize: 11, color: "#10B981", display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981" }} />
              {selectedDoc ? "Studying your document" : "Online"}
            </div>
          </div>
          {selectedDoc && (
            <button onClick={() => { setSelectedDoc(""); setContext(""); }} className="btn btn-gh btn-xs" style={{ marginLeft: "auto" }}>
              Clear document
            </button>
          )}
        </div>

        <div className="chat-msgs" style={{ flex: 1 }}>
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.role === "assistant" ? "msg-ai" : "msg-u"}`}>
              <div className={`mav ${m.role === "assistant" ? "mav-ai" : "mav-u"}`}>{m.role === "assistant" ? "AI" : "U"}</div>
              <div className={`mb ${m.role === "assistant" ? "mb-ai" : "mb-u"}`}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="msg msg-ai">
              <div className="mav mav-ai">AI</div>
              <div className="mb mb-ai" style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <div className="typing-dot d1" /><div className="typing-dot d2" /><div className="typing-dot d3" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {msgs.length <= 2 && (
          <div style={{ padding: "0 14px 10px", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setInput(s)} className="btn btn-gh btn-xs" style={{ fontSize: 12 }}>{s}</button>
            ))}
          </div>
        )}

        <div className="chat-input-area">
          <textarea
            className="chat-input"
            placeholder="Ask anything or paste study material..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={1}
          />
          <button className="send-btn" onClick={send} disabled={loading || !input.trim()}>
            {loading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <Send size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
