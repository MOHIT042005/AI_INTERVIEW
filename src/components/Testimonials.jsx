import React from "react";

function Testimonials() {
  const testimonials = [
    {
      quote: "The mock flow helped me answer with a lot more structure.",
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      outcome: "Offer in 5 weeks",
      initials: "PS"
    },
    {
      quote: "The feedback caught where I sounded vague, and that made my next round much stronger.",
      name: "Rahul Patel",
      role: "Full Stack Developer",
      outcome: "Confidence score +18%",
      initials: "RP"
    },
    {
      quote: "The saved feedback made my final-round prep feel much less chaotic.",
      name: "Anjali Singh",
      role: "Product Manager at Amazon",
      outcome: "Final-round prep reset",
      initials: "AS"
    }
  ];

  return (
    <section className="testimonials">
      <div className="section-heading">
        <span className="section-badge">Social proof</span>
        <h2>What focused practice feels like for real users</h2>
        <p className="section-subtitle">
          Join professionals using structured repetition and AI feedback to sharpen performance.
        </p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <article key={testimonial.name} className="testimonial-card">
            <div className="testimonial-topline">
              <span className="stars">4.9/5 rating</span>
              <span className="testimonial-outcome">{testimonial.outcome}</span>
            </div>
            <p className="quote">"{testimonial.quote}"</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar" aria-hidden="true">
                {testimonial.initials}
              </div>
              <div>
                <h4>{testimonial.name}</h4>
                <p>{testimonial.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
