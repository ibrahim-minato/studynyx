import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Home, FileText, Brain, HelpCircle, MessageSquare, TrendingUp, Settings, LogOut, Calendar, X, Menu, Zap, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { id: "overview", path: "/dashboard", icon: <Home size={16} />, label: "Overview" },
  { id: "documents", path: "/dashboard/documents", icon: <FileText size={16} />, label: "Documents" },
  { id: "flashcards", path: "/dashboard/flashcards", icon: <Brain size={16} />, label: "Flashcards" },
  { id: "quiz", path: "/dashboard/quiz", icon: <HelpCircle size={16} />, label: "Quizzes" },
  { id: "tutor", path: "/dashboard/tutor", icon: <MessageSquare size={16} />, label: "AI Tutor" },
  { id: "plan", path: "/dashboard/plan", icon: <Calendar size={16} />, label: "Study Plan" },
  { id: "progress", path: "/dashboard/progress", icon: <TrendingUp size={16} />, label: "Progress" },
];

const plans = [
  {
    name: "Pro", price: "$6.99", period: "/mo",
    color: "#7C3AED", bg: "rgba(124,58,237,0.12)",
    feats: ["Unlimited documents", "Unlimited flashcards", "Unlimited quizzes", "Full AI Tutor", "Progress analytics", "Priority support"],
  },
  {
    name: "Team", price: "$14.99", period: "/mo",
    color: "#06B6D4", bg: "rgba(6,182,212,0.1)",
    feats: ["Everything in Pro", "Up to 5 members", "Shared library", "Group progress", "Team leaderboard", "Admin dashboard"],
  },
];

function UpgradeModal({ onClose }) {
  const [selected, setSelected] = useState(0);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#0D1120", border: "1px solid #1A2235", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480, position: "relative", animation: "fadeUp 0.3s ease" }} onClick={e => e.stopPropagation()}>
        
        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#5E7094" }}><X size={18} /></button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#6D28D9,#A78BFA)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Zap size={20} color="white" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Upgrade StudyNyx</h2>
          <p style={{ color: "#5E7094", fontSize: 13 }}>Unlock unlimited access to all AI features</p>
        </div>

        {/* Plan tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {plans.map((p, i) => (
            <button key={i} onClick={() => setSelected(i)} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `2px solid ${selected === i ? p.color : "#1A2235"}`, background: selected === i ? p.bg : "transparent", color: selected === i ? p.color : "#5E7094", cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}>
              {p.name}
            </button>
          ))}
        </div>

        {/* Selected plan */}
        {(() => {
          const p = plans[selected];
          return (
            <div style={{ background: "#111826", border: `1px solid ${p.color}33`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: p.color }}>{p.price}</span>
                <span style={{ color: "#5E7094", fontSize: 13 }}>{p.period}</span>
              </div>
              {p.feats.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#94A3B8", marginBottom: 9 }}>
                  <Check size={14} color={p.color} style={{ flexShrink: 0 }} />{f}
                </div>
              ))}
            </div>
          );
        })()}

        <button className="btn btn-pr btn-full" style={{ justifyContent: "center", fontSize: 15, padding: "13px" }}>
          <Zap size={15} /> Upgrade to {plans[selected].name} — {plans[selected].price}{plans[selected].period}
        </button>
        <p style={{ textAlign: "center", color: "#374469", fontSize: 11, marginTop: 10 }}>Cancel anytime · No hidden fees</p>
      </div>
    </div>
  );
}

export default function Sidebar({ active }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [active]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => { logout(); navigate("/"); };

  const SidebarContent = () => (
    <>
      <div className="sb-logo" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" className="logo" onClick={() => setMobileOpen(false)}>
          <div className="logo-ic"><BookOpen size={15} color="white" /></div>
          <span className="logo-tx">StudyNyx</span>
        </Link>
        <button onClick={() => setMobileOpen(false)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#5E7094", padding: 4 }} className="sb-close-btn">
          <X size={20} />
        </button>
      </div>

      <nav className="sb-nav">
        <div className="sb-lbl">Main</div>
        {navItems.map((item) => (
          <Link key={item.id} to={item.path} className={`si ${active === item.id ? "act" : ""}`} style={{ textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
            {item.icon}{item.label}
          </Link>
        ))}
        <div className="sb-lbl" style={{ marginTop: 20 }}>Account</div>
        <Link to="/dashboard/settings" className={`si ${active === "settings" ? "act" : ""}`} style={{ textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
          <Settings size={16} /> Settings
        </Link>
      </nav>

      <div className="sb-foot">
        {/* Upgrade button — only show on free plan */}
        {(!user?.plan || user?.plan === "free") && (
          <button onClick={() => setUpgradeOpen(true)} style={{ width: "100%", marginBottom: 10, background: "linear-gradient(135deg,rgba(109,40,217,0.2),rgba(139,92,246,0.1))", border: "1px solid rgba(109,40,217,0.3)", borderRadius: 10, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#7C3AED"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(109,40,217,0.3)"}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6D28D9,#A78BFA)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Zap size={13} color="white" />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#A78BFA" }}>Upgrade to Pro</div>
              <div style={{ fontSize: 10, color: "#5E7094" }}>Unlock all features</div>
            </div>
          </button>
        )}

        {/* User profile */}
        <div className="sb-usr" onClick={handleLogout}>
          <div className="uav">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#EDF0FF" }}>{user?.name || "User"}</div>
            <div style={{ fontSize: 11, color: user?.plan === "pro" ? "#A78BFA" : "#5E7094", textTransform: "capitalize" }}>
              {user?.plan || "free"} plan
            </div>
          </div>
          <LogOut size={13} style={{ marginLeft: "auto", color: "#2E3D5C" }} />
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        .sb-close-btn { display: none !important; }
        @media (max-width: 900px) {
          .sb-close-btn { display: flex !important; align-items: center; justify-content: center; }
          .sidebar-desktop { display: none !important; }
          .mobile-sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 200; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
          .mobile-sidebar-overlay.open { opacity: 1; pointer-events: all; }
          .mobile-sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 260px; background: #070B18; border-right: 1px solid #1A2235; display: flex; flex-direction: column; z-index: 201; transform: translateX(-100%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
          .mobile-sidebar.open { transform: translateX(0); }
        }
        @media (min-width: 901px) {
          .mobile-sidebar-overlay, .mobile-sidebar, .hamburger-btn { display: none !important; }
        }
      `}</style>

      {/* Desktop sidebar */}
      <aside className="sidebar sidebar-desktop"><SidebarContent /></aside>

      {/* Hamburger */}
      <button className="hamburger-btn" onClick={() => setMobileOpen(true)} style={{ position: "fixed", top: 13, left: 16, zIndex: 100, background: "#0D1120", border: "1px solid #1A2235", borderRadius: 9, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#EDF0FF" }}>
        <Menu size={18} />
      </button>

      {/* Mobile overlay + sidebar */}
      <div className={`mobile-sidebar-overlay ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(false)} />
      <aside className={`mobile-sidebar ${mobileOpen ? "open" : ""}`}><SidebarContent /></aside>

      {/* Upgrade modal */}
      {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} />}
    </>
  );
}
