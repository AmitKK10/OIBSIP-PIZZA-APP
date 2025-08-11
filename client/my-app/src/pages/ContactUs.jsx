import React, { useState } from "react";
import "./ContactUs.css";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errs.email = "Email address is invalid.";
    }
    if (!formData.message.trim()) errs.message = "Message cannot be empty.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitSuccess(false);
      return;
    }
    // Simulate async form submit
    setSubmitted(true);
    setSubmitSuccess(null);

    setTimeout(() => {
      setSubmitted(false);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    }, 2000);
  };

  return (
    <section className="contact-section">
      <div className="contact-grid">
        <div className="contact-info" aria-label="Contact details">
          <h1>Contact Us</h1>
          <ul>
            <li><FaMapMarkerAlt aria-hidden="true" /> Digha Science City Road, West Bengal, 721463</li>
            <li><FaPhoneAlt aria-hidden="true" /> <a href="tel:+919563574862">+91 9563574862</a></li>
            <li><FaEnvelope aria-hidden="true" /> <a href="mailto:amitkiran1007@gmail.com">amitkiran1007@gmail.com</a></li>
          </ul>
          <p className="contact-note">We’re here for all your pizza cravings!</p>
        </div>
        <form className="contact-form" onSubmit={handleSubmit} noValidate aria-live="polite" aria-busy={submitted}>
          <h2>Send a Message</h2>

          <div className={`input-group ${formData.name ? "filled" : ""} ${errors.name ? "error" : ""}`}>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-describedby="name-error"
              aria-invalid={!!errors.name}
              autoComplete="name"
            />
            <label htmlFor="name">Your Name</label>
            {errors.name && <span className="input-error" id="name-error">{errors.name}</span>}
          </div>

          <div className={`input-group ${formData.email ? "filled" : ""} ${errors.email ? "error" : ""}`}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-describedby="email-error"
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
            <label htmlFor="email">Your Email</label>
            {errors.email && <span className="input-error" id="email-error">{errors.email}</span>}
          </div>

          <div className={`input-group textarea-group ${formData.message ? "filled" : ""} ${errors.message ? "error" : ""}`}>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              aria-describedby="message-error"
              aria-invalid={!!errors.message}
            />
            <label htmlFor="message">Your Message</label>
            {errors.message && <span className="input-error" id="message-error">{errors.message}</span>}
          </div>

          <button type="submit" disabled={submitted} aria-live="assertive" aria-label="Send message">
            <FaPaperPlane />
            {submitted ? "Sending..." : "Send"}
          </button>

          {submitSuccess === true && (
            <div className="submit-feedback success" role="alert">
              <FaCheckCircle aria-hidden="true" /> Message sent successfully!
            </div>
          )}
          {submitSuccess === false && (
            <div className="submit-feedback error" role="alert">
              <FaTimesCircle aria-hidden="true" /> Please fix the errors above before submitting.
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;
