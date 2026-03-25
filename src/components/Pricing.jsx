import React from "react";

function Pricing() {
  return (
    <div className="pricing">

      <h2>Simple, Transparent Pricing</h2>

      <p>Choose the plan that fits your needs. Cancel anytime.</p>

      <div className="pricing-grid">

        <div className="price-card">

          <h3>Starter</h3>

          <h1>₹199</h1>

          <p><strong>per month</strong></p>

          <p>✓ 50 Interview Questions</p>
          <p>✓ Performance Reports</p>
          <p>✓ Basic Analytics</p>

          <button className="price-btn">
            Get Started
          </button>

        </div>


        <div className="price-card highlight">

          <h3>Professional</h3>

          <h1>₹1999</h1>

          <p><strong>per year (Save 67%)</strong></p>

          <p>✓ Unlimited Questions</p>
          <p>✓ Advanced AI Feedback</p>
          <p>✓ Detailed Analytics</p>

          <button className="price-btn">
            Best Value
          </button>

        </div>

      </div>

    </div>
  );
}

export default Pricing;