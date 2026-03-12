import React from "react";

function Hero() {
  return (
    <div style={styles.hero}>
      <h1>AI-Driven Interview Simulator</h1>
      <p>
        Practice technical interviews with real-time evaluation and AI feedback.
      </p>

      <button style={styles.button}>Start Mock Interview</button>
    </div>
  );
}

const styles = {
  hero: {
    textAlign: "center",
    padding: "100px 20px"
  },
  button: {
    marginTop: "20px",
    padding: "12px 25px",
    fontSize: "16px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};

export default Hero;