import React from "react";

function Hero(){
  return(
    <div className="hero">

      <div className="hero-text">

        <h1>
          Ace Technical Interviews
        </h1>

        <p>
          Practice with 1000+ real interview questions. Get instant AI feedback on your coding approach, communication, and problem-solving. Join 50,000+ professionals who've landed their dream jobs.
        </p>

        <div className="hero-buttons">

          <button className="primary">
            Start Free Trial
          </button>

          <button className="secondary">
            Learn More
          </button>

        </div>

      </div>

      <div>
        <img 
          src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=500&fit=crop"
          alt="Interview Preparation"
        />
      </div>

    </div>
  )
}

export default Hero;