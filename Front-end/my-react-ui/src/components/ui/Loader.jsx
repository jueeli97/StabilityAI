import React from "react";

export default function Loader({ label="Loading..." }){
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, color:"var(--muted)", fontWeight:800, fontSize:13 }}>
      <span style={{
        width:16, height:16,
        borderRadius:"50%",
        border:"2px solid rgba(47,62,99,0.18)",
        borderTopColor:"var(--accent)",
        display:"inline-block",
        animation:"spin 0.8s linear infinite"
      }}/>
      {label}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}