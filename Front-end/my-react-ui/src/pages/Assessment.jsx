import React from "react";
import Card from "../components/ui/Card.jsx";
import AssessmentForm from "../components/forms/AssessmentForm.jsx";

export default function Assessment(){
  return (
    <main className="container" style={{ padding: "26px 0 44px" }}>
      <Card>
        <h2 style={{ margin:"0 0 6px", fontSize: 22, fontWeight: 950, color:"var(--primary)" }}>
          Tell us your situation
        </h2>
        <p className="p" style={{ marginTop: 8 }}>
          Enter monthly values. This is a demo — we don’t store your data.
        </p>
        <div style={{ marginTop: 18 }}>
          <AssessmentForm />
        </div>
      </Card>
    </main>
  );
}