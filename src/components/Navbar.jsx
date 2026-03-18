import React from "react";

function Navbar(){
  return(
    <div className="navbar">

      <div className="logo">
        Intervio
      </div>

      <div className="nav-links">
        <span>Home</span>
        <span>About</span>
        <span>Features</span>
        <span>Testimonials</span>
      </div>
      
      <button className="start-btn">
        Start Interview
      </button>

    </div>
  )
}

export default Navbar;