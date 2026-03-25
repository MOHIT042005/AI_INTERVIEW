import React from "react";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your free account in seconds. No credit card required to get started."
    },
    {
      number: "02",
      title: "Choose Interview",
      description: "Select from 1000+ curated interview questions across your tech stack."
    },
    {
      number: "03",
      title: "Practice & Learn",
      description: "Get real-time feedback on your answers with AI-powered analysis."
    },
    {
      number: "04",
      title: "Improve & Excel",
      description: "Track your progress and master technical interviews with confidence."
    }
  ];

  return (
    <div className="how-it-works">
      <h2>How It Works</h2>
      <p className="section-subtitle">Get interview-ready in just 4 simple steps</p>
      
      <div className="steps-grid">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <div className="step-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            {index < steps.length - 1 && <div className="step-arrow">→</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;
