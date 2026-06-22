import { useState } from "react";
import { User, Lock, Bell, Palette, Trash2, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile
  const [name, setName] = useState(user?.name || "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Notifications (stored in localStorage)
  const [notifs, setNotifs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sn_notifs")) || { reminders: true, quizResults: false, streaks: true }; }
    catch { return { reminders: true, quizResults: false, streaks: true }; }
  });

  // Theme (stored in localStorage)
  const [theme, setTheme] = useState(() => localStorage.getItem("sn_theme") || "dark");

  // ── Save profile ──
  const saveProfile = async () => {
    if (!name.trim()) return setProfileErr("Name cannot be empty.");
    setProfileLoading(true); setProfileErr(""); setProfileMsg("");
    try {
      await api.patch("/users/profile", { name: name.trim() });
      setProfileMsg("Profile saved successfully.");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch (err) {
      setProfileErr(err.response?.data?.message || "Failed to save profile.");
    } finally { setProfileLoading(false); }
  };

  // ── Change password ──
  const changePassword = async () => {
    setPwErr(""); setPwMsg("");
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) return setPwErr("All fields are required.");
    if (pwForm.next.length < 6) return setPwErr("New password must be at least 6 characters.");
    if (pwForm.next !== pwForm.confirm) return setPwErr("Passwords do not match.");
    setPwLoading(true);
    try {
      await api.patch("/users/password", { currentPassword: pwForm.current, newPassword: pwForm.next });
      setPwMsg("Password updated successfully.");
      setPwForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwMsg(""), 3000);
    } catch (err) {
      setPwErr(err.response?.data?.message || "Failed to update password.");
    } finally { setPwLoading(false); }
  };

  // ── Toggle notification ──
  const toggleNotif = (key) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    localStorage.setItem("sn_notifs", JSON.stringify(updated));
  };

  // ── Switch theme ──
  const switchTheme = (t) => {
    setTheme(t);
    localStorage.setItem("sn_theme", t);
    // Apply basic theme token to root
    document.documentElement.setAttribute("data-theme", t);
    if (t === "light") {
      document.body.style.background = "#F4F5F9";
      document.body.style.color = "#0A0E1A";
    } else {
      document.body.style.background = "#060A14";
      document.body.style.color = "#EDF0FF";
    }
  };

  // ── Sign out ──
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ── Delete account ──
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!confirmed) return;
    try {
      await api.delete("/users/account");
      logout();
      navigate("/");
    } catch {
      alert("Failed to delete account. Please try again.");
    }
  };

  const Toggle = ({ on, onClick }) => (
    <div onClick={onClick} style={{ width: 40, height: 22, borderRadius: 100, background: on ? "#7C3AED" : "#1A2235", cursor: "pointer", position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: on ? 21 : 3, transition: "left 0.25s" }} />
    </div>
  );

  const Success = ({ msg }) => msg ? (
    <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 12 }}>✓ {msg}</div>
  ) : null;

  const Err = ({ msg }) => msg ? <div className="alert-err">{msg}</div> : null;

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Settings</h2>
      <p style={{ color: "#5E7094", fontSize: 13, marginBottom: 28 }}>Manage your account and preferences.</p>

      {/* Profile */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <User size={16} color="#7C3AED" />
          <span style={{ fontSize: 15, fontWeight: 600 }}>Profile</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#6D28D9,#A78BFA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "white", flexShrink: 0 }}>
            {name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{name}</div>
            <div style={{ fontSize: 13, color: "#5E7094" }}>{user?.email}</div>
            <div style={{ fontSize: 11, color: "#A78BFA", marginTop: 2, textTransform: "capitalize" }}>{user?.plan || "free"} plan</div>
          </div>
        </div>

        <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Display name</label>
        <input className="inp" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ marginBottom: 10 }} />

        <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Email address</label>
        <input className="inp" value={user?.email || ""} disabled style={{ opacity: 0.5, marginBottom: 14, cursor: "not-allowed" }} />

        <Err msg={profileErr} />
        <Success msg={profileMsg} />
        <button className="btn btn-pr btn-sm" onClick={saveProfile} disabled={profileLoading}>
          {profileLoading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <><Save size={14} /> Save Profile</>}
        </button>
      </div>

      {/* Password */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Lock size={16} color="#7C3AED" />
          <span style={{ fontSize: 15, fontWeight: 600 }}>Change Password</span>
        </div>
        <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Current password</label>
        <input className="inp" type="password" placeholder="••••••••" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} style={{ marginBottom: 10 }} />
        <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>New password</label>
        <input className="inp" type="password" placeholder="At least 6 characters" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} style={{ marginBottom: 10 }} />
        <label style={{ display: "block", fontSize: 12, color: "#7B8EB5", marginBottom: 6 }}>Confirm new password</label>
        <input className="inp" type="password" placeholder="••••••••" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} style={{ marginBottom: 14 }} />
        <Err msg={pwErr} />
        <Success msg={pwMsg} />
        <button className="btn btn-gh btn-sm" onClick={changePassword} disabled={pwLoading}>
          {pwLoading ? <div className="spinner spinner-dark" style={{ width: 14, height: 14 }} /> : <><Lock size={14} /> Update Password</>}
        </button>
      </div>

      {/* Notifications */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Bell size={16} color="#7C3AED" />
          <span style={{ fontSize: 15, fontWeight: 600 }}>Notifications</span>
        </div>
        {[
          { key: "reminders", l: "Study reminders", d: "Get reminded to study daily" },
          { key: "quizResults", l: "Quiz results", d: "Notified when a quiz is ready" },
          { key: "streaks", l: "Streak alerts", d: "Don't break your study streak" },
        ].map((n, i, arr) => (
          <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: i < arr.length - 1 ? "1px solid #1A2235" : "none" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{n.l}</div>
              <div style={{ fontSize: 12, color: "#5E7094" }}>{n.d}</div>
            </div>
            <Toggle on={notifs[n.key]} onClick={() => toggleNotif(n.key)} />
          </div>
        ))}
        <div style={{ fontSize: 11, color: "#374469", marginTop: 12 }}>Preferences saved automatically.</div>
      </div>

      {/* Appearance */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Palette size={16} color="#7C3AED" />
          <span style={{ fontSize: 15, fontWeight: 600 }}>Appearance</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { t: "dark", l: "Dark", preview: "#060A14" },
            { t: "light", l: "Light", preview: "#F4F5F9" },
          ].map(({ t, l, preview }) => (
            <div key={t} onClick={() => switchTheme(t)} style={{ flex: 1, padding: 14, background: preview, border: `2px solid ${theme === t ? "#7C3AED" : "#1A2235"}`, borderRadius: 10, cursor: "pointer", textAlign: "center", transition: "border 0.2s" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: t === "dark" ? "#EDF0FF" : "#0A0E1A" }}>{l}</div>
              {theme === t && <div style={{ fontSize: 11, color: "#A78BFA", marginTop: 3 }}>✓ Active</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.02)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Trash2 size={16} color="#EF4444" />
          <span style={{ fontSize: 15, fontWeight: 600, color: "#EF4444" }}>Danger Zone</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingBottom: 14, borderBottom: "1px solid rgba(239,68,68,0.1)" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Sign out</div>
            <div style={{ fontSize: 12, color: "#5E7094" }}>End your current session</div>
          </div>
          <button onClick={handleLogout} style={{ background: "transparent", color: "#F87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 9, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
            Sign Out
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 14 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Delete account</div>
            <div style={{ fontSize: 12, color: "#5E7094" }}>Permanently delete your account and all data</div>
          </div>
          <button onClick={handleDelete} style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 9, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
