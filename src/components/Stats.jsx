import React from "react";

function Stats() {
  const stats = [
    { number: "50,000+", label: "Active Learners" },
    { number: "1,000+", label: "Interview Questions" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="stats">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h2 className="stat-number">{stat.number}</h2>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
