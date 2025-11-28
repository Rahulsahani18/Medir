import React, { useState, useRef, useEffect } from "react";
import "./Home.css";

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const contentRefs = useRef([]);

  const faqData = [
    {
      question: "How do I book an appointment with a doctor?",
      answer:
        "You can book an appointment by calling our helpline, using our mobile app, or through our website. Simply select your preferred doctor, choose an available time slot, and confirm your booking.",
    },
    {
      question: "Can I request a specific doctor when booking my appointment?",
      answer:
        "Yes, you can request a specific doctor when booking your appointment. Our system allows you to view available doctors, their specializations, and their available time slots to help you make an informed choice.",
    },
    {
      question:
        "What should I do if I need to cancel or reschedule my appointment?",
      answer:
        "You can cancel or reschedule your appointment up to 24 hours before the scheduled time through our website or mobile app. Alternatively, you can call our customer service team for assistance.",
    },
    {
      question: "What if I'm running late for my appointment?",
      answer:
        "If you're running late, please contact the clinic as soon as possible. We'll do our best to accommodate you, but depending on the schedule, you may need to wait or reschedule your appointment.",
    },
    {
      question: "Can I book appointments for family members or dependents?",
      answer:
        "Yes, you can book appointments for family members or dependents. Simply add their profiles to your account and select their name when booking an appointment.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Auto adjust height smoothly
  useEffect(() => {
    contentRefs.current.forEach((ref, i) => {
      if (ref) {
        if (activeIndex === i) {
          ref.style.maxHeight = ref.scrollHeight + "px";
          ref.style.paddingTop = "12px";
          ref.style.paddingBottom = "24px";
        } else {
          ref.style.maxHeight = "0px";
          ref.style.paddingTop = "0";
          ref.style.paddingBottom = "0";
        }
      }
    });
  }, [activeIndex]);

  return (
    <div className="faqs-container">
      <div className="faqs-wrapper">
        <div className="section-header">
          <div className="featured-badge">✦ FAQ'S ✦</div>
          <h2 className="section-title">Your Questions are Answered</h2>
        </div>

        <div className="faqs-accordion">
          {faqData.map((faq, index) => (
            <div key={index} className="faqs-item">
              <button
                className={`faqs-question ${activeIndex === index ? "faqs-active" : ""}`}
                onClick={() => toggleAccordion(index)}
              >
                <span className="faqs-question-text">{faq.question}</span>
                <span className="faqs-icon">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>

              {/* This div will animate smoothly */}
              <div
                className="faqs-answer"
                ref={(el) => (contentRefs.current[index] = el)}
                style={{
                  maxHeight: activeIndex === index ? "0px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.5s ease",
                  paddingTop: "0",
                  paddingBottom: "0",
                }}
              >
                <div className="faqs-answer-content">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;