import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail } from "lucide-react";
import api from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="lp">
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <Link to="/login" className="btn btn-gh btn-sm">← Back to Login</Link>
      </div>
      <div className="card fu" style={{ width: "100%", maxWidth: 400, borderRadius: 20, padding: 36 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 28 }}>
          <div className="logo-ic"><BookOpen size={18} color="white" /></div>
          <span className="logo-tx">StudyNyx</span>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Mail size={24} color="#10B981" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Check your email</h2>
            <p style={{ color: "#5E7094", fontSize: 13, lineHeight: 1.65, marginBottom: 24 }}>
              We sent a reset link to <strong style={{ color: "#EDF0FF" }}>{email}</strong>. Click it to reset your password.
            </p>
            <p style={{ color: "#374469", fontSize: 12, marginBottom: 20 }}>Didn't receive it? Check your spam folder.</p>
            <button className="btn btn-gh btn-sm btn-full" onClick={() => setSent(false)}>Try a different email</button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 7 }}>Forgot password?</h2>
            <p style={{ color: "#5E7094", fontSize: 13, textAlign: "center", marginBottom: 28 }}>Enter your email and we'll send you a reset link.</p>
            {error && <div className="alert-err">{error}</div>}
            <form onSubmit={submit}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#7B8EB5", marginBottom: 6 }}>Email address</label>
              <input className="inp" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: 20 }} />
              <button type="submit" className="btn btn-pr btn-full" disabled={loading}>
                {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : "Send Reset Link"}
              </button>
            </form>
            <div style={{ textAlign: "center", color: "#5E7094", fontSize: 13, marginTop: 20 }}>
              Remember it? <Link to="/login" style={{ color: "#A78BFA", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
