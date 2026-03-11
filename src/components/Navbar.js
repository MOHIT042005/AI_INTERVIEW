import React from "react";

function Features() {
  return (
    <div style={styles.container}>
      <h2>Platform Features</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Interview Simulation</h3>
          <p>Practice with timed coding interview problems.</p>
        </div>

        <div style={styles.card}>
          <h3>AI Feedback</h3>
          <p>Receive intelligent feedback on your performance.</p>
        </div>

        <div style={styles.card}>
          <h3>Performance Analytics</h3>
          <p>Track strengths and weaknesses across topics.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "50px 20px",
    textAlign: "center"
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginTop: "30px"
  },
  card: {
    width: "250px",
    padding: "20px",
    background: "#f1f5f9",
    borderRadius: "8px"
  }
};

export default Features;