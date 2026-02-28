import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Assessment from "../pages/Assessment.jsx";
import Results from "../pages/Results.jsx";

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/results" element={<Results />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}