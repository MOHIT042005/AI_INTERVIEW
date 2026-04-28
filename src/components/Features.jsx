function Features() {
  const features = [
    {
      kicker: "Flow",
      stat: "5 practice modes",
      title: "Structured question tracks",
      description:
        "Move through technical, behavioral, mock, and skill-based rounds without planning every session yourself.",
      note: "Role-based prompts keep practice focused."
    },
    {
      kicker: "Feedback",
      stat: "Actionable scoring",
      title: "A tighter feedback loop after every attempt",
      description:
        "See where your answers felt strong or vague so your next round improves on something concrete.",
      note: "Clarity and confidence are surfaced right away."
    },
    {
      kicker: "Progress",
      stat: "One clean history",
      title: "Progress you can actually track",
      description:
        "Keep your sessions and scores in one place so momentum does not disappear between practice days.",
      note: "Recent results make the next practice step obvious."
    }
  ];

  return (
    <section className="features" id="features">
      <div className="section-heading">
        <span className="section-badge">Why Intervio</span>
        <h2>Practice with a system, not scattered prep</h2>
        <p className="section-subtitle">
          Designed to make interview prep feel calmer, sharper, and easier to repeat every week.
        </p>
      </div>

      <div className="feature-grid">
        {features.map((feature) => (
          <article key={feature.title} className="card">
            <div className="card-head">
              <span className="card-kicker">{feature.kicker}</span>
              <span className="card-stat">{feature.stat}</span>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <p className="card-note">{feature.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Features;
