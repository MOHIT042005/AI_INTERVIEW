import React from "react";

function Hero(){
  return(
    <div className="hero">

      <div className="hero-text">

        <h1>
        All-In-One AI Interview Platform
        </h1>

        <p>
        Our platform uses artificial intelligence to simulate real technical interviews and analyze candidate performance.
        </p>

        <div className="hero-buttons">

          <button className="primary">
          Request Demo
          </button>

          <button className="secondary">
          Learn More
          </button>

        </div>

      </div>

      <div>
        <img 
        src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28"
        width="400"
        />
      </div>

    </div>
  )
}

export default Hero;