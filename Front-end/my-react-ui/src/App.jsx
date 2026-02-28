import React from "react";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App(){
  return (
    <div style={{ minHeight: "100vh", display:"flex", flexDirection:"column" }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
}

