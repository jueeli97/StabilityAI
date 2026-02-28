import React from "react";

const map = {
  Low:   { bg:"#ECFDF5", fg:"#047857", bd:"#A7F3D0" },
  Medium:{ bg:"#FFFBEB", fg:"#B45309", bd:"#FDE68A" },
  High:  { bg:"#FFF1F2", fg:"#BE123C", bd:"#FDA4AF" },
};

export default function Badge({ level="Medium" }){
  const c = map[level] || map.Medium;
  return (
    <span style={{
      display:"inline-flex",
      alignItems:"center",
      gap:8,
      padding:"8px 12px",
      borderRadius:999,
      border:`1px solid ${c.bd}`,
      background:c.bg,
      color:c.fg,
      fontWeight: 950,
      fontSize: 12
    }}>
      {level} Risk
    </span>
  );
}