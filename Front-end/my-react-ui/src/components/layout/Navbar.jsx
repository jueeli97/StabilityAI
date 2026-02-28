import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar(){
  const { pathname } = useLocation();

  const NavItem = ({ to, label }) => (
    <Link
      to={to}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        fontWeight: 800,
        fontSize: 13,
        color: pathname === to ? "var(--primary)" : "rgba(47,62,99,0.78)",
        background: pathname === to ? "rgba(255,255,255,0.85)" : "transparent",
        border: pathname === to ? "1px solid var(--border)" : "1px solid transparent",
        boxShadow: pathname === to ? "var(--shadowSm)" : "none"
      }}
    >
      {label}
    </Link>
  );

  return (
    <header style={{
      position:"sticky", top:0, zIndex:20,
      borderBottom: "1px solid rgba(15,23,42,0.08)",
      background: "rgba(242,244,246,0.78)",
      backdropFilter: "blur(10px)"
    }}>
      <div className="container" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0" }}>
        <Link to="/" style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width:44, height:44, borderRadius:16,
            display:"grid", placeItems:"center",
            background:"rgba(255,255,255,0.85)",
            border:"1px solid var(--border)",
            boxShadow:"var(--shadowSm)",
            fontWeight: 900, color:"var(--primary)"
          }}>
            HF
          </div>
          <div>
            <div style={{ fontWeight: 950, color:"var(--primary)" }}>HerFinance</div>
            <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>
              Stability planning for women in life transitions
            </div>
          </div>
        </Link>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <nav style={{ display:"flex", gap:6 }}>
            <NavItem to="/" label="Home" />
            <NavItem to="/assessment" label="Assessment" />
          </nav>
          <div style={{
            padding:"9px 12px", borderRadius:999,
            border:"1px solid var(--border)",
            background:"rgba(255,255,255,0.7)",
            fontSize:12, fontWeight:900, color:"var(--primary)"
          }}>
            Hackathon Demo
          </div>
        </div>
      </div>
    </header>
  );
}