import React from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Stats from "../components/Stats.jsx";
import Features from "../components/Features.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Testimonials from "../components/Testimonials.jsx";
import FAQ from "../components/FAQ.jsx";
import Pricing from "../components/Pricing.jsx";

function Home(){
  return(
    <>
      <Navbar/>
      <Hero/>
      <Stats/>
      <Features/>
      <HowItWorks/>
      <Testimonials/>
      <FAQ/>
      <Pricing/>
    </>
  )
}

export default Home;