import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaPizzaSlice,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,           // <-- Import YouTube icon
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const role = localStorage.getItem('role');
  const isLoggedIn = !!localStorage.getItem('token');

  // Function to check if the store is currently open (IST)
  const isStoreOpen = () => {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false };
    const hour = parseInt(
      now.toLocaleTimeString('en-US', options),
      10
    );
    return hour >= 11 && hour < 23; // Store open between 11 AM - 11 PM
  };

  const storeStatus = isStoreOpen();

  return (
    <footer className="footer-container">
      <div className="footer-grid">

        {/* Column 1: Brand and Socials */}
        <div className="footer-column">
          <Link to="/" className="footer-logo">
            <FaPizzaSlice />
            <span>Pizza App</span>
          </Link>
          <p className="footer-tagline">
            Your favorite pizza, delivered hot and fresh right to your door.
          </p>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/Kingsumanamitkirankar10?rdid=tZkYMEI1XY89Xhpq&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1YVaiKp2Rs%2F#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://x.com/i/flow/login?redirect_after_login=%2FAmitKK1007"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/amit_kiran_kar_10/?igsh=dWN0bGwwNmU4cXRo#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/amit-kiran-kar-975744277?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://youtube.com/@amitkk-jz3ji?feature=shared" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/custom-pizza">Build Your Pizza</Link></li>
            <li><Link to="/my-orders">My Orders</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>

        {/* Column 3: Role-based */}
        <div className="footer-column">
          {isLoggedIn && role === 'admin' ? (
            <>
              <h3 className="footer-heading">Admin Panel</h3>
              <ul className="footer-links">
                <li><Link to="/admin-dashboard">Dashboard</Link></li>
                <li><Link to="/admin-inventory">Inventory</Link></li>
                <li><Link to="/admin-orders">Orders</Link></li>
              </ul>
            </>
          ) : (
            <>
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-links">
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/terms-of-service">Terms of Service</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              </ul>
            </>
          )}
        </div>

        {/* Column 4: Contact Info & Hours */}
        <div className="footer-column">
          <h3 className="footer-heading">Get In Touch</h3>
          <ul className="footer-contact">
            <li><FaMapMarkerAlt /> <span>Digha Science City Road,West Bengal, 721463</span></li>
            <li><FaEnvelope /> <a href="mailto:amitkiran1007@gmail.com">amitkiran1007@gmail.com</a></li>
            <li><FaPhoneAlt /> <a href="tel:+919563574862">+91 9563574862</a></li>
          </ul>
          <div className="store-hours">
            <h4 className="store-hours-title">Opening Hours</h4>
            <p>Mon - Sun: 11:00 AM - 11:00 PM</p>
            <div className={`status-indicator ${storeStatus ? 'open' : 'closed'}`}>
              <span className="status-dot"></span>
              We're currently {storeStatus ? 'Open' : 'Closed'}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Pizza App. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
