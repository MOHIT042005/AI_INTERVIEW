function Features() {
  return (
    <div className="features" id="features">
      <h2>Why Choose Us</h2>
      <p>Designed to make practice feel less intimidating and more repeatable.</p>

      <div className="feature-grid">
        <div className="card">
          <h3>Structured question sets</h3>
          <p>
            Practice technical, behavioral, mock, quick, and skill-focused rounds without
            needing to plan the session yourself.
          </p>
        </div>

        <div className="card">
          <h3>Faster feedback loop</h3>
          <p>
            Review scores, comments, and focus areas after each session so you always know
            what to improve next.
          </p>
        </div>

        <div className="card">
          <h3>Progress you can see</h3>
          <p>
            Keep a running history of sessions, scores, duration, and answer quality in one
            simple workspace.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Features;
