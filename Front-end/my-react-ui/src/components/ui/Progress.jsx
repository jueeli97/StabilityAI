import React from "react";

export default function Progress({ value=0 }){
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div style={{
      height: 10,
      borderRadius: 999,
      background: "rgba(47,62,99,0.10)",
      overflow:"hidden",
      border: "1px solid rgba(15,23,42,0.08)"
    }}>
      <div style={{
        height:"100%",
        width: `${v}%`,
        background: "linear-gradient(90deg, var(--accent), rgba(76,156,148,0.55))"
      }}/>
    </div>
  );
}