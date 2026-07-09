import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function ResetPassword() {
  const { token } = useParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      login(res.data.token, res.data.user);
      setDone(true);
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. The link may have expired.");
    } finally { setLoading(false); }
  };

  return (
    <div className="lp">
      <div className="card fu" style={{ width: "100%", maxWidth: 400, borderRadius: 20, padding: 36 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 28 }}>
          <div className="logo-ic"><BookOpen size={18} color="white" /></div>
          <span className="logo-tx">StudyNyx</span>
        </div>

        {done ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Password reset!</h2>
            <p style={{ color: "#5E7094", fontSize: 13 }}>Redirecting you to your dashboard...</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 7 }}>Set new password</h2>
            <p style={{ color: "#5E7094", fontSize: 13, textAlign: "center", marginBottom: 28 }}>Choose a strong password for your account.</p>
            {error && <div className="alert-err">{error}</div>}
            <form onSubmit={submit}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#7B8EB5", marginBottom: 6 }}>New password</label>
              <div style={{ position: "relative", marginBottom: 14 }}>
                <input className="inp" type={showPw ? "text" : "password"} placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#5E7094" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#7B8EB5", marginBottom: 6 }}>Confirm password</label>
              <input className="inp" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} required style={{ marginBottom: 20 }} />
              <button type="submit" className="btn btn-pr btn-full" disabled={loading}>
                {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : "Reset Password"}
              </button>
            </form>
            <div style={{ textAlign: "center", color: "#5E7094", fontSize: 13, marginTop: 20 }}>
              <Link to="/login" style={{ color: "#A78BFA", textDecoration: "none" }}>← Back to Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
