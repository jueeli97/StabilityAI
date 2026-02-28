import React from "react";

export default function Footer(){
  return (
    <footer style={{ padding: "22px 0 34px", color:"var(--muted)" }}>
      <div className="container" style={{ display:"flex", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
        <div style={{ fontSize: 13 }}>
          Built for demo speed: clear inputs → stable UX.
        </div>
        <div style={{ fontSize: 13 }}>
          Tip: press <span className="kbd">Ctrl</span> + <span className="kbd">L</span> to highlight the address bar in your demo flow.
        </div>
      </div>
    </footer>
  );
}