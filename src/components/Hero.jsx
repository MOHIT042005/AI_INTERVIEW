import React from "react";
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="hero">
      <div className="hero-text">
        <h1>Ace Technical Interviews</h1>

        <p>
          Practice with curated mock interviews, get fast feedback on your answers, and
          build confidence with a workflow that is easy to stick with.
        </p>

        <div className="hero-pills">
          <span>Guided question flow</span>
          <span>Score and feedback history</span>
          <span>Simple dashboard insights</span>
        </div>

        <div className="hero-buttons">
          <Link to="/signup" className="hero-link primary">
            Start Practicing
          </Link>

          <a href="#features" className="hero-link secondary">
            See Features
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-floating-card hero-floating-top">
          <span>Interview score</span>
          <strong>84%</strong>
          <p>Clear structure, stronger examples needed.</p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=500&fit=crop"
          alt="Interview Preparation"
        />
        <div className="hero-floating-card hero-floating-bottom">
          <span>This week</span>
          <strong>3 sessions completed</strong>
          <p>Behavioral answers improved the most.</p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
