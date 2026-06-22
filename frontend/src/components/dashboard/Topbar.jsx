import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ title }) {
  const { user } = useAuth();
  return (
    <header className="topbar">
      {/* spacer for hamburger on mobile */}
      <div style={{ width: 44 }} className="topbar-hamburger-space" />
      <div className="tb-tit">{title}</div>
      <div className="sb2">
        <Search size={13} color="#374469" />
        <input placeholder="Search..." />
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div className="ibtn ndot"><Bell size={15} /></div>
        <div className="uav" style={{ cursor: "pointer" }}>{user?.name?.[0]?.toUpperCase() || "U"}</div>
      </div>

      <style>{`
        @media (min-width: 901px) {
          .topbar-hamburger-space { display: none !important; }
        }
      `}</style>
    </header>
  );
}
