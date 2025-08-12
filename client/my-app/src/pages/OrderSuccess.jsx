import { useLocation,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./OrderSuccess.css"; // Make sure to import the new CSS

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate ();
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    // This logic correctly gets order details from navigation state or localStorage
    if (location.state) {
      setOrderDetails(location.state);
      localStorage.setItem("lastOrder", JSON.stringify(location.state));
    } else {
      const savedOrder = localStorage.getItem("lastOrder");
      if (savedOrder) {
        setOrderDetails(JSON.parse(savedOrder));
      }
    }
  }, [location.state]);

  const { paymentId, totalPrice } = orderDetails;

  return (
    <div className="order-success-wrapper">
      <div className="order-success-card">
        <div className="success-icon-container">
          <svg
            className="success-checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="success-checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="success-checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <h1 className="order-success-heading">Order Placed Successfully!</h1>
        <p className="order-success-subheading">
          Thank you for your purchase. Your pizza is on its way!
        </p>

        {paymentId ? (
          <div className="order-details-box">
            <div className="order-detail-item">
              <span className="detail-label">Payment ID</span>
              <span className="detail-value payment-id">{paymentId}</span>
            </div>
            <div className="order-detail-item">
              <span className="detail-label">Total Amount Paid</span>
              <span className="detail-value total-price">₹{totalPrice}</span>
            </div>
          </div>
        ) : (
          <p className="order-error">
            Payment details not available. Please check your order history for more information.
          </p>
        )}

        <div className="order-success-actions">
           <button className="action-button primary" onClick={() => navigate("/home")}>
            Continue Shopping
          </button>
          <button className="action-button secondary" onClick={() => navigate("/my-orders")}>
            View Order History
          </button>
        </div>
      </div>
    </div>
  );
}
