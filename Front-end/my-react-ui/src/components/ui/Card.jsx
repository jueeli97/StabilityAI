import React from "react";

export default function Card({ children, style, ...props }){
  return (
    <div
      {...props}
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
        padding: 26,
        ...style
      }}
    >
      {children}
    </div>
  );
}