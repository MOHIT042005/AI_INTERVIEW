import React from "react";

function Testimonials() {
  const testimonials = [
    {
      quote: "This platform helped me land a job at a top tech company. The feedback is incredibly accurate and detailed.",
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      quote: "I improved my interview skills drastically. The AI feedback caught things I wouldn't have noticed myself.",
      name: "Rahul Patel",
      role: "Full Stack Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      quote: "Worth every penny. The question variety and analysis quality are unmatched in the market.",
      name: "Anjali Singh",
      role: "Product Manager at Amazon",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
  ];

  return (
    <div className="testimonials">
      <h2>What Our Users Say</h2>
      <p className="section-subtitle">Join thousands of professionals who've improved their interview skills</p>
      
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="quote">"{testimonial.quote}"</p>
            <div className="testimonial-author">
              <img src={testimonial.image} alt={testimonial.name} className="author-image" />
              <div>
                <h4>{testimonial.name}</h4>
                <p>{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
