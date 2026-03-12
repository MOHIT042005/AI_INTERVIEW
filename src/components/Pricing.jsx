import React from "react";

function Pricing() {
  return (
    <div className="pricing">

      <h2>Pricing</h2>

      <div className="pricing-grid">

        <div className="price-card">

          <h3>Monthly</h3>

          <h1>₹199</h1>

          <p>Access to AI interview simulator</p>

          <p>Basic analytics</p>

          <button className="price-btn">
            Choose Plan
          </button>

        </div>


        <div className="price-card highlight">

          <h3>Yearly</h3>

          <h1>₹1999</h1>

          <p>Full interview simulations</p>

          <p>AI performance feedback</p>

          <button className="price-btn">
            Best Value
          </button>

        </div>

      </div>

    </div>
  );
}

export default Pricing;