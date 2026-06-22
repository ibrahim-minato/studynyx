import { useState, useEffect, useRef } from "react";
import { FileText, Upload, Trash2, Plus } from "lucide-react";
import api from "../../api";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState("list"); // list | upload
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const load = () => {
    api.get("/documents").then(r => setDocs(r.data.documents || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const uploadText = async () => {
    if (!text.trim()) return setError("Please enter some content.");
    setError(""); setUploading(true);
    try {
      await api.post("/documents/upload", { content: text, title: title || "Pasted Content" });
      setText(""); setTitle(""); setTab("list"); load();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally { setUploading(false); }
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", file.name.replace(/\.[^.]+$/, ""));
    setUploading(true);
    try {
      await api.post("/documents/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      load(); setTab("list");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally { setUploading(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete this document?")) return;
    await api.delete(`/documents/${id}`);
    setDocs(d => d.filter(x => x._id !== id));
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Documents</h2>
          <p style={{ color: "#5E7094", fontSize: 13 }}>{docs.length} document{docs.length !== 1 ? "s" : ""} in your library</p>
        </div>
        <button className="btn btn-pr btn-sm" onClick={() => setTab(t => t === "upload" ? "list" : "upload")}>
          <Plus size={14} /> {tab === "upload" ? "Back to Library" : "Add Document"}
        </button>
      </div>

      {tab === "upload" && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Add Study Material</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button className="btn btn-pr btn-sm" onClick={() => fileRef.current?.click()}>
              {uploading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <><Upload size={14} /> Upload PDF/TXT</>}
            </button>
            <input ref={fileRef} type="file" accept=".pdf,.txt" style={{ display: "none" }} onChange={uploadFile} />
          </div>
          <div style={{ borderTop: "1px solid #1A2235", paddingTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Or paste text directly</label>
            <input className="inp" placeholder="Document title" value={title} onChange={e => setTitle(e.target.value)} style={{ marginBottom: 10 }} />
            <textarea className="inp" style={{ minHeight: 160 }} placeholder="Paste your study material here..." value={text} onChange={e => setText(e.target.value)} />
            {error && <div className="alert-err" style={{ marginTop: 10 }}>{error}</div>}
            <button className="btn btn-pr" style={{ marginTop: 12, width: "100%", justifyContent: "center" }} onClick={uploadText} disabled={uploading}>
              {uploading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : "Save Document"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}><div className="spinner spinner-dark" style={{ width: 28, height: 28, margin: "0 auto" }} /></div>
      ) : docs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-ic"><FileText size={22} /></div>
          <h3 style={{ color: "#EDF0FF", fontSize: 17, fontWeight: 600, marginBottom: 8 }}>No documents yet</h3>
          <p style={{ color: "#5E7094", fontSize: 13, marginBottom: 20 }}>Upload a PDF or paste text to get started</p>
          <button className="btn btn-pr btn-sm" onClick={() => setTab("upload")}><Plus size={14} /> Add Document</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {docs.map(d => (
            <div key={d._id} className="card card-hover" style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(124,58,237,0.14)", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{d.title}</div>
                  <div style={{ fontSize: 11, color: "#5E7094" }}>{d.fileType.toUpperCase()} · {(d.fileSize / 1024).toFixed(1)} KB</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#5E7094", marginBottom: 12 }}>{new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 100, fontWeight: 600, background: "rgba(16,185,129,0.1)", color: "#10B981" }}>Ready</span>
                <button onClick={() => del(d._id)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#374469", transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#F87171"}
                  onMouseLeave={e => e.currentTarget.style.color = "#374469"}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
