import React, { useState, useRef, useEffect } from 'react';
import './FAQ.css';
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";

const faqs = [
  {
    question: "How do I order a pizza?",
    answer: "Simply register if are a new user or  login, select your favorite pizza or build your own, add to cart and checkout. Delivery is fast & hot!"
  },
  {
    question: "Can I track my order?",
    answer: "Yes! Go to 'My Orders' after logging in to see live order status and tracking."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept UPI, cards, net banking, and cash on delivery at select locations."
  },
  {
    question: "Do you offer contactless delivery?",
    answer: "Absolutely! Opt for contactless delivery during checkout for a safe handoff."
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const onKeyDown = (e, idx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(idx);
    }
  };

  return (
    <section className="faq-section" aria-label="Frequently Asked Questions">
      <div className="faq-header">
        <FaQuestionCircle className="faq-icon-main" aria-hidden="true" />
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to our most common queries.</p>
      </div>
      <div className="faq-list">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div className={`faq-item ${isOpen ? "open" : ""}`} key={idx}>
              <button
                className="faq-question"
                onClick={() => toggle(idx)}
                onKeyDown={(e) => onKeyDown(e, idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-question-${idx}`}
              >
                <span>{item.question}</span>
                <span
                  className={`faq-icon ${isOpen ? "rotated" : ""}`}
                  aria-hidden="true"
                >
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>
              <div
                id={`faq-answer-${idx}`}
                role="region"
                aria-labelledby={`faq-question-${idx}`}
                className="faq-answer"
                ref={el => contentRefs.current[idx] = el}
                style={{
                  maxHeight: isOpen ? contentRefs.current[idx]?.scrollHeight : 0,
                  opacity: isOpen ? 1 : 0,
                  transition: 'max-height 0.4s ease, opacity 0.4s ease'
                }}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
