import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Cart.css";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    phone: "",
  });

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    document.body.classList.add("dark-mode");

    const savedAddress = localStorage.getItem("userAddress");
    if (savedAddress) {
      try {
        const parsed = JSON.parse(savedAddress);
        if (typeof parsed === "object" && parsed.street) {
          setAddress(parsed);
        } else {
          setAddress({ ...address, street: savedAddress });
        }
      } catch (e) {
        setAddress({ ...address, street: savedAddress });
      }
    }

    return () => document.body.classList.remove("dark-mode");
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  
  const discountedPrice = Math.round(totalPrice * (1 - discount));

  const handleApplyCoupon = () => {
    const entered = coupon.trim().toUpperCase();
    if (entered === "PIZZA10" || entered === "AMIT10") {
      setDiscount(0.1);
      toast.success("Coupon applied! 10% discount.");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon!");
    }
  };

  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const verifyPayment = async (paymentData) => {
    try {
      const response = await axios.post(
        "http://localhost:55000/api/payment/verify",
        paymentData
      );
      return response.data;
    } catch (error) {
      console.error("Verification error:", error);
      return { success: false };
    }
  };

  const placeOrder = async (paymentResponse) => {
    try {
      const token = localStorage.getItem("token");
      const fullAddress = `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`;
      localStorage.setItem("userAddress", JSON.stringify(address));
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      }));

      const orderData = {
        items: orderItems,
        totalAmount: discountedPrice, 
        paymentInfo: {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        },
        address: fullAddress,
        phone: address.phone,
        coupon: discount > 0 ? coupon.trim().toUpperCase() : undefined,
      };

      const response = await axios.post(
        "http://localhost:55000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        clearCart();
        toast.success("Order placed successfully!");
        navigate("/order-success", {
          state: {
            paymentId: paymentResponse.razorpay_payment_id,
            totalPrice: discountedPrice,
          },
        });
      } else {
        throw new Error(response.data.message || "Order failed");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error(
        `Failed to place order: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return toast.warning("Cart is empty!");
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill in your complete address and pincode.");
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }

    const isRazorpayLoaded = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!isRazorpayLoaded) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:55000/api/payment/create-order",
        { amount: discountedPrice }
      );

      if (!data.success) {
        toast.error("Failed to create Razorpay order.");
        return;
      }

      const { id: order_id, amount, currency } = data.order;

      const options = {
        key: "rzp_test_A08OypRcpquXgC",
        amount,
        currency,
        name: "Pizza Delivery App",
        description: "Payment for your delicious pizza",
        order_id,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              await placeOrder(response);
            } else {
              toast.error("❌ Payment verification failed.");
            }
          } catch (err) {
            console.error("Order processing error:", err);
            toast.error("❌ Order processing failed. Please contact support.");
          }
        },
        prefill: {
          name: "Test User",
          email: "testuser@example.com",
          contact: "9876543210",
        },
        theme: { color: "#ff6600" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment.");
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-grid">
            {cartItems.map((pizza, index) => (
              <div key={index} className="cart-card">
                <img
                  src={pizza.image || "https://via.placeholder.com/200"}
                  alt={pizza.name}
                  className="cart-img"
                />
                <div className="cart-details">
                  <h4>{pizza.name}</h4>
                  <p>
                    <strong>Size:</strong> {pizza.size}
                  </p>
                  <p className="cart-price">₹{pizza.price * pizza.quantity}</p>
                  <div className="cart-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() => decreaseQuantity(index)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity-value">{pizza.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(index)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

         
          <div className="address-coupon-container">
          
            <div className="left-column">
              <div className="address-form">
                <h3>Delivery Address</h3>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={address.email || ""}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={address.phone || ""}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                />
              </div>
            </div>

            
            <div className="right-column">
              <div className="coupon-section">
                <h3>Have a Coupon?</h3>
                <div className="coupon-input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="coupon-input"
                  />
                  <button
                    type="button"
                    className="apply-coupon-btn"
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </button>
                </div>
                {discount > 0 && (
                  <p className="coupon-message success">
                    Coupon applied: <b>{coupon.trim().toUpperCase()}</b> (
                    {discount * 100}% off)
                  </p>
                )}
              </div>

          <div className="cart-summary">
            <h3>
              Total: ₹
              {discount > 0 ? (
                <>
                  <span
                    style={{ textDecoration: "line-through", color: "#bb3333" }}
                  >
                    ₹{totalPrice}
                  </span>{" "}
                  <span style={{ color: "#22bb55" }}>{discountedPrice}</span>
                </>
              ) : (
                totalPrice
              )}
            </h3>
          </div>

             
              <button className="place-order-btn" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>
          </div>

          
        </>
      )}
    </div>
  );
};

export default Cart;
