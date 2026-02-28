import React from "react";
import HeroSection from "../components/home/HeroSection.jsx";
import HowItWorks from "../components/home/HowItWorks.jsx";

export default function Home(){
  return (
    <main className="container">
      <HeroSection />
      <HowItWorks />
    </main>
  );
}