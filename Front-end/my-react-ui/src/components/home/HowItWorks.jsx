import React from "react";
import Card from "../ui/Card.jsx";

export default function HowItWorks(){
  const steps = [
    { n:"01", t:"Enter financial details", d:"Persona + monthly income, expenses, debt and dependents." },
    { n:"02", t:"Get stability score", d:"We compute stability and risk level for fast understanding." },
    { n:"03", t:"Receive AI recovery plan", d:"Clear text plan + voice audio to guide next actions." }
  ];

  return (
    <section id="how" style={{ padding: "18px 0 38px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:12, flexWrap:"wrap" }}>
        <h2 style={{ margin:0, fontSize: 22, color:"var(--primary)", fontWeight: 950 }}>
          How it works
        </h2>
        <div style={{ color:"var(--muted)", fontWeight: 800, fontSize: 13 }}>
          Built for quick judge demos: <span style={{ color:"var(--primary)" }}>Home → Form → Results</span>
        </div>
      </div>

      <div style={{ marginTop: 14, display:"grid", gap: 12, gridTemplateColumns:"repeat(3, minmax(0, 1fr))" }}>
        {steps.map((s) => (
          <Card key={s.n} style={{ padding: 18, boxShadow:"var(--shadowSm)" }}>
            <div style={{ fontWeight: 950, color:"var(--accent)", fontSize: 12 }}>{s.n}</div>
            <div style={{ marginTop: 8, fontWeight: 950, color:"var(--primary)" }}>{s.t}</div>
            <div style={{ marginTop: 6, color:"var(--muted)", fontSize: 14, lineHeight: 1.55 }}>{s.d}</div>
          </Card>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px){
          section#how > div + div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}