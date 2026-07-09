import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Upload, FileAudio, Copy, Brain, HelpCircle, CheckCircle, Loader, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function Transcription() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("upload"); // upload | live

  // ── Upload state ──
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const [uploadErr, setUploadErr] = useState("");
  const fileRef = useRef(null);

  // ── Live state ──
  const [listening, setListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  // ── Shared ──
  const [copied, setCopied] = useState(false);

  const activeText = tab === "upload" ? uploadText : liveText;

  // Check browser support
  useEffect(() => {
    if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
      setSupported(false);
    }
  }, []);

  // ── Audio Upload ──
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setUploadText("");
    setUploadErr("");
  };

  const transcribeAudio = async () => {
    if (!file) return;
    setUploading(true); setUploadErr("");
    const fd = new FormData();
    fd.append("audio", file);
    try {
      const res = await api.post("/transcription/audio", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadText(res.data.transcription);
    } catch (err) {
      setUploadErr(err.response?.data?.message || "Transcription failed. Check file size (max 20MB).");
    } finally { setUploading(false); }
  };

  // ── Live Lecture ──
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (e) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      setLiveText(final);
      setInterimText(interim);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
    setInterimText("");
  };

  // ── Shared actions ──
  const copy = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveAsDoc = async () => {
    if (!activeText.trim()) return;
    try {
      await api.post("/documents/upload", {
        content: activeText,
        title: tab === "upload" ? (file?.name?.replace(/\.[^.]+$/, "") || "Transcription") : `Live Lecture — ${new Date().toLocaleDateString()}`,
      });
      alert("Saved to Documents!");
    } catch { alert("Failed to save."); }
  };

  const goFlashcards = () => {
    sessionStorage.setItem("sn_prefill_text", activeText);
    navigate("/dashboard/flashcards");
  };

  const goQuiz = () => {
    sessionStorage.setItem("sn_prefill_text", activeText);
    navigate("/dashboard/quiz");
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Transcription</h2>
      <p style={{ color: "#5E7094", fontSize: 13, marginBottom: 24 }}>Convert audio or live speech to text, then generate flashcards or quizzes from it.</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {[
          { id: "upload", label: "🎵 Upload Audio", desc: "MP3, WAV, M4A" },
          { id: "live", label: "🎙️ Live Lecture", desc: "Speak in real time" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "12px 16px", borderRadius: 11, border: `2px solid ${tab === t.id ? "#7C3AED" : "#1A2235"}`, background: tab === t.id ? "rgba(124,58,237,0.1)" : "#0D1120", cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: tab === t.id ? "#A78BFA" : "#EDF0FF", marginBottom: 2 }}>{t.label}</div>
            <div style={{ fontSize: 11, color: "#5E7094" }}>{t.desc}</div>
          </button>
        ))}
      </div>

      {/* ── UPLOAD TAB ── */}
      {tab === "upload" && (
        <div>
          {/* Drop zone */}
          <div onClick={() => fileRef.current?.click()} style={{ border: `2px dashed ${file ? "#7C3AED" : "#1A2235"}`, borderRadius: 14, padding: "36px 24px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: file ? "rgba(124,58,237,0.05)" : "#0D1120", marginBottom: 16 }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#7C3AED"}
            onMouseLeave={e => e.currentTarget.style.borderColor = file ? "#7C3AED" : "#1A2235"}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setFile(f); setUploadText(""); setUploadErr(""); } }}>
            <input ref={fileRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={handleFile} />
            <FileAudio size={32} color={file ? "#7C3AED" : "#374469"} style={{ marginBottom: 12 }} />
            {file ? (
              <>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{file.name}</div>
                <div style={{ fontSize: 12, color: "#5E7094" }}>{(file.size / (1024 * 1024)).toFixed(2)} MB · Click to change</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Drop your audio file here</div>
                <div style={{ fontSize: 13, color: "#5E7094" }}>or click to browse · MP3, WAV, M4A, OGG · Max 20MB</div>
              </>
            )}
          </div>

          {uploadErr && <div className="alert-err" style={{ marginBottom: 14 }}>{uploadErr}</div>}

          <button className="btn btn-pr" style={{ width: "100%", justifyContent: "center", marginBottom: 16 }} onClick={transcribeAudio} disabled={!file || uploading}>
            {uploading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Transcribing audio...</> : <><Upload size={16} /> Transcribe Audio</>}
          </button>

          {uploading && (
            <div style={{ textAlign: "center", padding: "32px", color: "#5E7094", fontSize: 13 }}>
              <div style={{ width: 40, height: 40, border: "3px solid rgba(109,40,217,0.2)", borderTopColor: "#7C3AED", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" }} />
              Gemini is reading your audio file...
            </div>
          )}
        </div>
      )}

      {/* ── LIVE TAB ── */}
      {tab === "live" && (
        <div>
          {!supported ? (
            <div className="alert-err">Your browser doesn't support live transcription. Please use Chrome or Edge.</div>
          ) : (
            <>
              <div style={{ background: "#0D1120", border: "1px solid #1A2235", borderRadius: 14, padding: 24, marginBottom: 16, textAlign: "center" }}>
                {/* Mic button */}
                <div onClick={listening ? stopListening : startListening} style={{ width: 80, height: 80, borderRadius: "50%", background: listening ? "linear-gradient(135deg,#EF4444,#DC2626)" : "linear-gradient(135deg,#6D28D9,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", cursor: "pointer", boxShadow: listening ? "0 0 0 8px rgba(239,68,68,0.15), 0 0 0 16px rgba(239,68,68,0.07)" : "0 0 0 8px rgba(109,40,217,0.15)", transition: "all 0.3s" }}>
                  {listening ? <MicOff size={32} color="white" /> : <Mic size={32} color="white" />}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                  {listening ? "🔴 Recording... Speak now" : "Click to start recording"}
                </div>
                <div style={{ fontSize: 13, color: "#5E7094" }}>
                  {listening ? "Click again to stop" : "Make sure your microphone is allowed in the browser"}
                </div>

                {/* Live waveform dots */}
                {listening && (
                  <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 16 }}>
                    {[...Array(8)].map((_, i) => (
                      <div key={i} style={{ width: 4, height: 4 + Math.random() * 20, borderRadius: 2, background: "#7C3AED", animation: `blink ${0.5 + Math.random() * 0.5}s ${i * 0.1}s infinite` }} />
                    ))}
                  </div>
                )}
              </div>

              <button className="btn btn-gh btn-sm" onClick={() => { setLiveText(""); setInterimText(""); }} style={{ marginBottom: 16 }}>
                <Trash2 size={13} /> Clear transcript
              </button>
            </>
          )}
        </div>
      )}

      {/* ── TRANSCRIPT OUTPUT ── */}
      {(activeText || (tab === "live" && interimText)) && (
        <div className="card" style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              Transcript
              {activeText && <span style={{ fontSize: 11, color: "#10B981", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: 100 }}>✓ Ready</span>}
            </div>
            {activeText && (
              <button onClick={copy} className="btn btn-gh btn-xs" style={{ gap: 5 }}>
                {copied ? <><CheckCircle size={12} color="#10B981" /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
            )}
          </div>

          <div style={{ background: "#111826", border: "1px solid #1A2235", borderRadius: 10, padding: 16, minHeight: 120, maxHeight: 280, overflowY: "auto", fontSize: 14, lineHeight: 1.7, color: "#EDF0FF", fontFamily: "'Inter', sans-serif", whiteSpace: "pre-wrap" }}>
            {activeText}
            {tab === "live" && interimText && (
              <span style={{ color: "#5E7094", fontStyle: "italic" }}>{interimText}</span>
            )}
            {!activeText && !interimText && (
              <span style={{ color: "#374469" }}>Transcript will appear here...</span>
            )}
          </div>

          {activeText && (
            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn-pr btn-sm" onClick={goFlashcards}><Brain size={14} /> Generate Flashcards</button>
              <button className="btn btn-gh btn-sm" onClick={goQuiz}><HelpCircle size={14} /> Generate Quiz</button>
              <button className="btn btn-gh btn-sm" onClick={saveAsDoc}><Upload size={14} /> Save as Document</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
