import React, { useState } from "react";

function FAQ() {
  const [expanded, setExpanded] = useState(null);

  const faqs = [
    {
      question: "What programming languages are covered?",
      answer: "We cover all major languages including Python, JavaScript, Java, C++, Go, Rust, and more with language-specific questions."
    },
    {
      question: "Can I use this on mobile?",
      answer: "Yes, our platform is fully responsive and works seamlessly on mobile, tablet, and desktop devices."
    },
    {
      question: "How often are new questions added?",
      answer: "We add 50+ new questions every week based on latest interview trends from top tech companies."
    },
    {
      question: "Is there a refund policy?",
      answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our platform."
    },
    {
      question: "Can I download my results?",
      answer: "Absolutely! You can download detailed reports of all your interviews and progress analytics."
    },
    {
      question: "Do you offer team plans?",
      answer: "Yes, we have special pricing for teams and educational institutions. Contact our sales team for details."
    }
  ];

  return (
    <div className="faq" id="faq">
      <h2>Frequently Asked Questions</h2>
      <p className="section-subtitle">Find answers to common questions about our platform</p>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              className={`faq-question ${expanded === index ? 'active' : ''}`}
              onClick={() => setExpanded(expanded === index ? null : index)}
            >
              <span>{faq.question}</span>
              <span className="faq-toggle">{expanded === index ? '-' : '+'}</span>
            </button>
            {expanded === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
