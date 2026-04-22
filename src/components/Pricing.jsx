import React from "react";

function Pricing() {
  return (
    <div className="pricing" id="pricing">
      <h2>Simple, Transparent Pricing</h2>
      <p>Choose the plan that fits your needs. Cancel anytime.</p>

      <div className="pricing-grid">
        <div className="price-card">
          <h3>Starter</h3>
          <h1>Rs 199</h1>
          <p><strong>per month</strong></p>
          <p>Included: 50 interview questions</p>
          <p>Included: performance reports</p>
          <p>Included: basic analytics</p>
          <button className="price-btn">Get Started</button>
        </div>

        <div className="price-card highlight">
          <h3>Professional</h3>
          <h1>Rs 1999</h1>
          <p><strong>per year (Save 67%)</strong></p>
          <p>Included: unlimited questions</p>
          <p>Included: advanced AI feedback</p>
          <p>Included: detailed analytics</p>
          <button className="price-btn">Best Value</button>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
