import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import Progress from "../ui/Progress.jsx";
import Button from "../ui/Button.jsx";

function safeNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

export default function ResultsView() {
  const nav = useNavigate();

  const result = useMemo(() => {
    const raw = sessionStorage.getItem("herfinance_result");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }, []);

  if (!result) {
    return (
      <Card style={{ marginTop: 26 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: "var(--primary)" }}>
          No results yet
        </h2>
        <p className="p">Generate your plan first.</p>
        <div style={{ marginTop: 16 }}>
          <Link to="/assessment">
            <Button>Go to Assessment</Button>
          </Link>
        </div>
      </Card>
    );
  }

  // Map keys (adjust if backend returns different)
  const stabilityScore = safeNum(result.stabilityScore ?? result.score ?? result.stability);
  const riskLevel = result.riskLevel ?? result.risk ?? "Medium";
  const benchmarkMessage = result.benchmarkMessage ?? result.benchmark ?? "";
  const aiPlanText = result.aiPlanText ?? result.plan ?? result.aiPlan ?? "";
  const audioUrl = result.audioUrl ?? result.audio ?? "";

  const scoreDisplay = stabilityScore === null ? "—" : `${stabilityScore}/100`;

  return (
    <div style={{ padding: "26px 0 44px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 950, color: "var(--primary)", letterSpacing: "-0.4px" }}>
            Your Results
          </h1>
          <p className="p" style={{ marginTop: 8 }}>
            Score, risk level, benchmark context, and your recovery plan (with audio).
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button variant="ghost" onClick={() => nav("/assessment")}>Edit Inputs</Button>
          <Button onClick={() => window.print()}>Print / Save</Button>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 12, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        <Card style={{ padding: 18, boxShadow: "var(--shadowSm)" }}>
          <div style={{ color: "var(--muted)", fontSize: 12, fontWeight: 950 }}>Stability Score</div>
          <div style={{ marginTop: 8, fontSize: 36, fontWeight: 950, color: "var(--primary)" }}>{scoreDisplay}</div>
          <div style={{ marginTop: 12 }}>
            <Progress value={stabilityScore ?? 0} />
          </div>
          <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 13, fontWeight: 800 }}>
            Higher score = more stability.
          </div>
        </Card>

        <Card style={{ padding: 18, boxShadow: "var(--shadowSm)" }}>
          <div style={{ color: "var(--muted)", fontSize: 12, fontWeight: 950 }}>Risk Level</div>
          <div style={{ marginTop: 10 }}>
            <Badge level={riskLevel} />
          </div>
          <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>
            Color-coded for fast readability.
          </div>
        </Card>

        <Card style={{ padding: 18, boxShadow: "var(--shadowSm)" }}>
          <div style={{ color: "var(--muted)", fontSize: 12, fontWeight: 950 }}>Benchmark</div>
          <div style={{ marginTop: 10, fontWeight: 950, color: "var(--primary)" }}>Compared to similar profiles</div>
          <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>
            {benchmarkMessage || "No benchmark message returned."}
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 12, gridTemplateColumns: "1.4fr 1fr" }}>
        <Card>
          <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 950, color: "var(--primary)" }}>
            Your Recovery Plan
          </h2>
          <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 850, marginBottom: 14 }}>
            Action steps you can follow immediately.
          </div>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, color: "rgba(15,23,42,0.92)" }}>
            {aiPlanText || "No plan text returned yet."}
          </div>
        </Card>

        <Card>
          <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 950, color: "var(--primary)" }}>
            Audio Guidance
          </h2>
          <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 850, marginBottom: 14 }}>
            Accessibility + wow factor.
          </div>

          <div style={{
            borderRadius: 18,
            border: "1px solid rgba(15,23,42,0.08)",
            background: "rgba(242,244,246,0.85)",
            padding: 14
          }}>
            {audioUrl ? (
              <audio controls src={audioUrl} style={{ width: "100%" }} />
            ) : (
              <div style={{ color: "var(--muted)", fontWeight: 850, fontSize: 13 }}>
                No audio URL returned.
              </div>
            )}
          </div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 900px){
          div[style*="grid-template-columns:repeat(3"]{ grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns:1.4fr"]{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}