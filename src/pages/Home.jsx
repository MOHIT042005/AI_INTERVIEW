import React, { useEffect } from "react";
import "../styles/home.css";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Testimonials from "../components/Testimonials.jsx";
import FAQ from "../components/FAQ.jsx";
import Pricing from "../components/Pricing.jsx";

function Home() {
  useEffect(() => {
    if (!window.location.hash) return;

    const id = window.location.hash.replace('#', '');
    const target = document.getElementById(id);

    if (target) {
      window.requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="home-page">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <Pricing />
      </main>
    </>
  );
}

export default Home;
