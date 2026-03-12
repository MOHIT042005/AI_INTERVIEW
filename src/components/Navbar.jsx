import React from "react";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2>AI Interview Simulator</h2>
      <div>
        <button style={styles.btn}>Login</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 40px",
    background: "#1e293b",
    color: "white",
    alignItems: "center"
  },
  btn: {
    padding: "8px 15px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer"
  }
};

export default Navbar;