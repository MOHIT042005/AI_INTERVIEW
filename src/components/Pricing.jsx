import React from "react";

function Pricing() {
  const plans = [
    {
      pill: "For starters",
      name: "Starter",
      price: "₹199",
      billing: "per month",
      note: "Good for light weekly prep and short interview cycles.",
      cta: "Start monthly",
      highlight: false,
      features: [
        "50 interview questions each month",
        "Performance reports after every session",
        "Basic analytics and saved history"
      ]
    },
    {
      pill: "Most popular",
      name: "Professional",
      price: "₹1,999",
      billing: "per year",
      note: "Best for consistent prep across multiple rounds and role changes.",
      cta: "Choose annual plan",
      highlight: true,
      savings: "Save 67%",
      features: [
        "Unlimited practice questions",
        "Advanced AI feedback with focus areas",
        "Detailed analytics and long-term progress tracking"
      ]
    }
  ];

  return (
    <section className="pricing" id="pricing">
      <div className="section-heading">
        <span className="section-badge">Pricing</span>
        <h2>Simple plans with a more serious upgrade path</h2>
        <p className="section-subtitle">
          Choose the tier that matches how intensely you want to prepare. Cancel anytime.
        </p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <article key={plan.name} className={`price-card ${plan.highlight ? 'highlight' : ''}`}>
            <div className="price-card-top">
              <span className="price-pill">{plan.pill}</span>
              {plan.savings ? <span className="price-save">{plan.savings}</span> : null}
            </div>
            <h3>{plan.name}</h3>
            <h1>{plan.price}</h1>
            <p className="price-billing"><strong>{plan.billing}</strong></p>
            <p className="price-note">{plan.note}</p>
            <ul className="price-features">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button className="price-btn">{plan.cta}</button>
          </article>
        ))}
      </div>

      <p className="pricing-footnote">
        Every plan includes curated question sets, a saved session history, and the option to upgrade anytime.
      </p>
    </section>
  );
}

export default Pricing;
