import React from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";
import DashboardPreview from "../components/DashboardPreview.jsx";

function Home(){
  return(
    <>
      <Navbar/>
      <Hero/>
      <Features/>
      <DashboardPreview/>
    </>
  )
}

export default Home;