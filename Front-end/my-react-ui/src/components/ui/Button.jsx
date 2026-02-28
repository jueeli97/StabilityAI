import React from "react";

export default function Button({ variant="primary", disabled, children, style, ...props }){
  const base = {
    borderRadius: 16,
    padding: "12px 18px",
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "transform .08s ease, opacity .15s ease, background .15s ease",
  };

  const primary = {
    border: "none",
    background: disabled ? "rgba(76,156,148,0.55)" : "var(--accent)",
    color: "white",
    boxShadow: disabled ? "none" : "0 10px 22px rgba(76,156,148,.22)"
  };

  const ghost = {
    border: "1px solid var(--border)",
    background: "rgba(255,255,255,0.75)",
    color: "var(--primary)",
    boxShadow: "var(--shadowSm)"
  };

  const merged = {
    ...base,
    ...(variant === "ghost" ? ghost : primary),
    ...style
  };

  return (
    <button
      disabled={disabled}
      {...props}
      style={merged}
      onMouseDown={(e)=>{ if(!disabled) e.currentTarget.style.transform = "translateY(1px)"; }}
      onMouseUp={(e)=>{ if(!disabled) e.currentTarget.style.transform = "translateY(0px)"; }}
      onMouseLeave={(e)=>{ if(!disabled) e.currentTarget.style.transform = "translateY(0px)"; }}
      onMouseOver={(e)=>{ if(!disabled && variant==="primary") e.currentTarget.style.background = "var(--accentHover)"; }}
      onMouseOut={(e)=>{ if(!disabled && variant==="primary") e.currentTarget.style.background = "var(--accent)"; }}
    >
      {children}
    </button>
  );
}