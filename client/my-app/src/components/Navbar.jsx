// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPizzaSlice,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaListAlt,
  FaHeart,
  FaShoppingCart,
  FaLock,
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const role = localStorage.getItem("role") || "guest";
  const userName = localStorage.getItem("name") || "User";
  const userEmail = localStorage.getItem("email") || "user@example.com";
  const userId = localStorage.getItem("userId") || "N/A";
  const userPhone = localStorage.getItem("phone") || "N/A";
  const userActive = localStorage.getItem("active") === "true";

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateCounts = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCartItems);
    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    updateCounts();

    const handleCountsUpdate = () => updateCounts();

    window.addEventListener("cartUpdated", handleCountsUpdate);
    window.addEventListener("wishlistUpdated", handleCountsUpdate);
    window.addEventListener("focus", updateCounts);

    return () => {
      window.removeEventListener("cartUpdated", handleCountsUpdate);
      window.removeEventListener("wishlistUpdated", handleCountsUpdate);
      window.removeEventListener("focus", updateCounts);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("phone");
    localStorage.removeItem("active");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="logo" onClick={() => navigate("/")}>
          <FaPizzaSlice className="logo-icon" /> Pizza App
        </h2>
        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isLoggedIn && (
        <div className={`navbar-right ${menuOpen ? "show" : ""}`}>
          {role === "customer" && (
            <>
              <button className="nav-btn" onClick={() => navigate("/home")}>
                Home
              </button>

              <button className="nav-btn" onClick={() => navigate("/custom-pizza")}>
                Custom Pizza
              </button>

              <button className="nav-icon-btn" onClick={() => navigate("/wishlist")}>
                <FaHeart />
                {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
              </button>

              <button className="nav-icon-btn" onClick={() => navigate("/cart")}>
                <FaShoppingCart />
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </button>

              <button className="nav-btn" onClick={() => navigate("/my-orders")}>
                <FaListAlt className="nav-icon" /> My Orders
              </button>
            </>
          )}

          {role === "admin" && (
            <button className="nav-btn" onClick={() => navigate("/admin-inventory")}>
              Admin Inventory
            </button>
          )}

          <div className="profile-menu" ref={profileRef}>
            <FaUserCircle
              className="profile-icon"
              onClick={() => setProfileOpen(!profileOpen)}
            />
            {profileOpen && (
              <div className="dropdown">
                <div className="dropdown-header">
  
                   <p className="user-name"><strong>User :</strong> {userName}</p>
                  <p className="user-email"><strong>Email: </strong>{userEmail}</p>
                  <p className="user-role"><strong>Role:</strong> {role}</p>
                 
                </div>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/change-password");
                  }}
                >
                  <FaLock className="dropdown-icon" /> Change Password
                </button>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <FaSignOutAlt className="dropdown-icon" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
