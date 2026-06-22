import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp">
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <Link to="/" className="btn btn-gh btn-sm">← Back</Link>
      </div>
      <div className="card fu" style={{ width: "100%", maxWidth: 400, borderRadius: 20, padding: 36 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 28 }}>
          <div className="logo-ic"><BookOpen size={18} color="white" /></div>
          <span className="logo-tx">StudyNyx</span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 7 }}>Create your account</h2>
        <p style={{ color: "#5E7094", fontSize: 13, textAlign: "center", marginBottom: 28 }}>Start studying smarter — it's free</p>

        {error && <div className="alert-err">{error}</div>}

        <form onSubmit={submit}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#7B8EB5", marginBottom: 6 }}>Full name</label>
          <input name="name" type="text" className="inp" placeholder="Your name" value={form.name} onChange={handle} required />

          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#7B8EB5", marginBottom: 6, marginTop: 14 }}>Email address</label>
          <input name="email" type="email" className="inp" placeholder="you@example.com" value={form.email} onChange={handle} required />

          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#7B8EB5", marginBottom: 6, marginTop: 14 }}>Password</label>
          <div style={{ position: "relative" }}>
            <input name="password" type={showPw ? "text" : "password"} className="inp" placeholder="At least 6 characters" value={form.password} onChange={handle} required style={{ paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#5E7094" }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <button type="submit" className="btn btn-pr btn-full" style={{ marginTop: 22 }} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : "Create account"}
          </button>
        </form>

        <div style={{ textAlign: "center", color: "#5E7094", fontSize: 12, marginTop: 20 }}>
          By signing up you agree to our{" "}
          <a href="#" style={{ color: "#A78BFA", textDecoration: "none" }}>Terms</a> &amp;{" "}
          <a href="#" style={{ color: "#A78BFA", textDecoration: "none" }}>Privacy Policy</a>
        </div>
        <div style={{ textAlign: "center", color: "#5E7094", fontSize: 13, marginTop: 16 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#A78BFA", fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
