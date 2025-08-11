import React, { useState } from "react";
import "./TermsOfService.css";
import { FaBalanceScale, FaChevronDown, FaChevronUp } from "react-icons/fa";

const sections = [
  {
    title: "1. Introduction",
    content:
      "Welcome to Pizza App. This Website is Built & Maintained by Mr. Amit Kiran Kar. By ordering from our platform, you agree to the terms outlined on this page.",
  },
  {
    title: "2. Ordering & Payment",
    content:
      "Orders are fulfilled subject to availability. Payment is due at checkout by any displayed payment method.",
  },
  {
    title: "3. Delivery Policy",
    content:
      "We strive for timely delivery, but cannot be held liable for delays due to unforeseen circumstances.",
  },
  {
    title: "4. Cancellations & Refunds",
    content:
      "Orders can only be canceled before they are prepared. Refunds are processed as per our refund policy.",
  },
  {
    title: "5. User Conduct",
    content:
      "Please use our platform responsibly. Abusive behavior may lead to account suspension.",
  },
  {
    title: "6. Changes to Terms",
    content:
      "We may update these Terms at any time. Continued use constitutes acceptance.",
  },
];

const TermsOfService = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const expandAll = () => setOpenIndex("all");
  const collapseAll = () => setOpenIndex(null);

  const filteredSections = sections.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="tos-section" aria-label="Terms of Service">
      <div className="tos-header">
        <FaBalanceScale className="tos-icon" aria-hidden="true" />
        <h1>Terms of Service</h1>
        <p>Important information for Pizza App users. Please read thoroughly.</p>
      </div>

      {/* Search Bar */}
      <div className="tos-search">
        <input
          type="text"
          placeholder="Search terms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="tos-actions">
          <button onClick={expandAll}>Expand All</button>
          <button onClick={collapseAll}>Collapse All</button>
        </div>
      </div>

      <div className="tos-body">
        {filteredSections.length > 0 ? (
          filteredSections.map(({ title, content }, index) => {
            const isOpen = openIndex === "all" || openIndex === index;
            return (
              <div
                className={`tos-section-item ${isOpen ? "open" : ""}`}
                key={index}
              >
                <button
                  className="tos-section-title"
                  onClick={() => toggleSection(index)}
                  aria-expanded={isOpen}
                  aria-controls={`tos-content-${index}`}
                  id={`tos-header-${index}`}
                >
                  <span>{title}</span>
                  <span
                    className={`tos-toggle-icon ${isOpen ? "rotated" : ""}`}
                  >
                    {isOpen ? (
                      <FaChevronUp aria-hidden="true" />
                    ) : (
                      <FaChevronDown aria-hidden="true" />
                    )}
                  </span>
                </button>
                <div
                  id={`tos-content-${index}`}
                  aria-labelledby={`tos-header-${index}`}
                  className="tos-section-content"
                  style={{
                    maxHeight: isOpen ? "500px" : "0",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p>{content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-results">No matching terms found.</p>
        )}
      </div>
    </section>
  );
};

export default TermsOfService;
