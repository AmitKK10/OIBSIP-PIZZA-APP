import React, { useState } from "react";
import "./PrivacyPolicy.css";
import { FaUserShield, FaChevronDown, FaChevronUp } from "react-icons/fa";

const sections = [
  {
    title: "1. What We Collect",
    content: "We collect only what’s needed: name, delivery address, contact and order details.",
  },
  {
    title: "2. How We Use Data",
    content: "Data is used for improving your experience, delivery, and customer support. We never sell your info!",
  },
  {
    title: "3. Cookies",
    content: "Our site uses cookies for login sessions and to personalize your experience.",
  },
  {
    title: "4. Third Parties",
    content: "We don’t share your data except for payment/delivery processing and legal compliance.",
  },
  {
    title: "5. Security",
    content: "All data is encrypted in transit and stored securely.",
  },
  {
    title: "6. Changes",
    content: "We may update our policy from time to time. Check this page for updates.",
  },
];

const PrivacyPolicy = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="privacy-section" aria-label="Privacy Policy">
      <div className="privacy-header">
        <FaUserShield className="privacy-icon" aria-hidden="true" />
        <h1>Privacy Policy</h1>
        <p>Your privacy is important to us. Learn how your data is protected.</p>
      </div>

      <div className="privacy-body">
        {sections.map(({ title, content }, index) => {
          const isOpen = openIndex === index;
          return (
            <div className={`privacy-section-item ${isOpen ? "open" : ""}`} key={index}>
              <button
                className="privacy-section-title"
                onClick={() => toggleSection(index)}
                aria-expanded={isOpen}
                aria-controls={`privacy-content-${index}`}
                id={`privacy-header-${index}`}
              >
                <span>{title}</span>
                <span className={`privacy-toggle-icon ${isOpen ? "rotated" : ""}`}>
                  {isOpen ? <FaChevronUp aria-hidden="true" /> : <FaChevronDown aria-hidden="true" />}
                </span>
              </button>
              <div
                id={`privacy-content-${index}`}
                aria-labelledby={`privacy-header-${index}`}
                className="privacy-section-content"
                style={{
                  maxHeight: isOpen ? "300px" : "0",
                  opacity: isOpen ? 1 : 0,
                  transition: "max-height 0.5s ease, opacity 0.5s ease",
                }}
              >
                <p>{content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PrivacyPolicy;
