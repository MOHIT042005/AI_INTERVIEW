import React from "react";
import { Link } from 'react-router-dom';

function Hero() {
  const scoreBars = [
    { label: "Clarity", score: 88 },
    { label: "Confidence", score: 84 }
  ];

  const roundPlan = [
    "Frontend problem solving",
    "Behavioral storytelling"
  ];

  return (
    <section className="hero">
      <div className="hero-text">
        <span className="hero-eyebrow">AI interview prep for serious candidates</span>
        <h1>Practice interviews with feedback you can actually use</h1>

        <p>
          Run mock interviews, review clear feedback, and improve with a prep flow that
          stays easy to repeat.
        </p>

        <div className="hero-pills">
          <span>Technical and behavioral rounds</span>
          <span>Clear scoring and saved feedback</span>
        </div>

        <div className="hero-buttons">
          <Link to="/signup" className="hero-link primary">
            Start Practicing
          </Link>

          <a href="#features" className="hero-link secondary">
            See Features
          </a>
        </div>

        <div className="hero-proof-row">
          <div className="hero-proof-item">
            <strong>4.9/5</strong>
            <span>Average learner rating</span>
          </div>
          <div className="hero-proof-item">
            <strong>50k+</strong>
            <span>Practice sessions completed</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-console" aria-label="Intervio feedback workspace preview">
          <div className="hero-console-top">
            <div className="hero-console-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="hero-console-label">Intervio feedback workspace</span>
            <span className="hero-console-status">Live analysis</span>
          </div>

          <div className="hero-console-body">
            <aside className="hero-console-sidebar">
              <span className="hero-console-heading">Round plan</span>
              <ul className="hero-console-list">
                {roundPlan.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>

            <div className="hero-console-main">
              <div className="hero-console-card">
                <div className="hero-console-card-head">
                  <div>
                    <span className="hero-mini-label">Interview summary</span>
                    <strong>Frontend mock round</strong>
                  </div>
                  <span className="hero-score-badge">84%</span>
                </div>
                <p>Clear structure overall. Add one sharper example to strengthen the final answer.</p>
              </div>

              <div className="hero-score-grid">
                {scoreBars.map((item) => (
                  <div key={item.label} className="hero-score-row">
                    <div className="hero-score-copy">
                      <span>{item.label}</span>
                      <strong>{item.score}%</strong>
                    </div>
                    <div className="hero-score-track" aria-hidden="true">
                      <span style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="hero-console-footer">
                <span className="hero-session-chip">3 sessions completed this week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
