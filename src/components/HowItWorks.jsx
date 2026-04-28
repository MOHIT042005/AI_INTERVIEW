import React from "react";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your free account in seconds and pick the role or interview style you want to improve first.",
      meta: "Fast onboarding"
    },
    {
      number: "02",
      title: "Choose Interview",
      description: "Select a technical, behavioral, mock, or system-design round built around a clear practice goal.",
      meta: "Role-based tracks"
    },
    {
      number: "03",
      title: "Practice & Learn",
      description: "Answer questions in a more realistic flow and review feedback that calls out structure, depth, and confidence.",
      meta: "Focused feedback"
    },
    {
      number: "04",
      title: "Improve & Excel",
      description: "Use your saved history and improvement signals to sharpen weak spots before the next real round.",
      meta: "Repeat with momentum"
    }
  ];

  return (
    <section className="how-it-works">
      <div className="section-heading">
        <span className="section-badge">How it works</span>
        <h2>Get interview-ready with a clean four-step rhythm</h2>
        <p className="section-subtitle">Start quickly, practice consistently, and improve with less friction.</p>
      </div>

      <div className="steps-grid">
        {steps.map((step) => (
          <article key={step.number} className="step-card">
            <div className="step-number">{step.number}</div>
            <span className="step-caption">{step.meta}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
