import React from "react";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import { useNavigate } from "react-router-dom";

export default function HeroSection(){
  const nav = useNavigate();

  return (
    <section style={{ padding: "34px 0 10px" }}>
      <div style={{ display:"grid", gap:18, gridTemplateColumns:"1.3fr 1fr", alignItems:"start" }}>
        <div>
          <h1 className="h1">
            Financial stability, made practical — for{" "}
            <span style={{ color:"var(--accent)" }}>real life</span>.
          </h1>
          <p className="p">
            Built for women navigating single parenting, divorce, or a career break.
            Enter your numbers and get a clear, supportive next-step plan — no judgment, just clarity.
          </p>

          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop: 16 }}>
            {["Simple inputs", "Women-focused context", "Built for quick decisions"].map((t) => (
              <span key={t} style={{
                padding:"9px 12px",
                borderRadius:999,
                border:"1px solid var(--border)",
                background:"rgba(255,255,255,0.72)",
                color:"var(--primary)",
                fontWeight: 850,
                fontSize: 12,
                boxShadow:"0 10px 20px rgba(16, 24, 40, 0.05)"
              }}>
                ✓ {t}
              </span>
            ))}
          </div>

          <div style={{ display:"flex", gap:10, marginTop: 18, flexWrap:"wrap" }}>
            <Button onClick={() => nav("/assessment")}>Start Assessment</Button>
            <Button variant="ghost" onClick={() => document.getElementById("how")?.scrollIntoView({ behavior:"smooth" })}>
              How it works
            </Button>
          </div>
        </div>

        <Card style={{ padding: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color:"var(--muted)" }}>Demo preview</div>
          <div style={{ marginTop: 8, fontSize: 20, fontWeight: 950, color:"var(--primary)" }}>
            Your stability snapshot
          </div>

          <div style={{
            marginTop: 14,
            borderRadius: 18,
            background:"rgba(242,244,246,0.85)",
            border:"1px solid rgba(15,23,42,0.08)",
            padding: 14
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <div style={{ color:"var(--muted)", fontSize: 12, fontWeight: 900 }}>Stability Score</div>
              <div style={{ color:"var(--primary)", fontSize: 26, fontWeight: 950 }}>— / 100</div>
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{ height: 10, borderRadius: 999, background:"rgba(47,62,99,0.10)" }}/>
            </div>
            <div style={{ marginTop: 10, color:"var(--muted)", fontSize: 13, lineHeight: 1.55 }}>
              After you submit the assessment, you’ll get a score, risk badge, benchmark message, AI plan, and audio guidance.
            </div>
          </div>

          <div style={{ marginTop: 14, display:"grid", gap:10 }}>
            {[
              ["Enter numbers", "Income, expenses, debt, dependents."],
              ["Generate plan", "We POST to /generate-plan."],
              ["Play audio", "Accessible voice guidance."]
            ].map(([title, desc]) => (
              <div key={title} style={{
                border:"1px solid rgba(15,23,42,0.08)",
                borderRadius: 16,
                background:"rgba(255,255,255,0.75)",
                padding: 12
              }}>
                <div style={{ fontWeight: 950, color:"var(--primary)" }}>{title}</div>
                <div style={{ fontSize: 13, color:"var(--muted)", marginTop: 3 }}>{desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 900px){
          section > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}