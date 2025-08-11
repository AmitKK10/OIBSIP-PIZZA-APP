import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import "./Wishlist.css";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();

  const loadWishlist = () => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  };

  useEffect(() => {
    loadWishlist();

    const syncWishlist = () => loadWishlist();

    window.addEventListener("wishlistUpdated", syncWishlist);
    window.addEventListener("focus", syncWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", syncWishlist);
      window.removeEventListener("focus", syncWishlist);
    };
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item._id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    toast.info("Removed from wishlist");
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const moveToCart = (pizza) => {
    addToCart(pizza);
    removeFromWishlist(pizza._id);
    toast.success(`${pizza.name} moved to cart`);
  };

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">❤️ My Wishlist</h2>

      <div className="wishlist-grid">
        {wishlist.length > 0 ? (
          wishlist.map((pizza) => (
            <div className="wishlist-card" key={pizza._id}>
              <img
                src={pizza.image || "https://via.placeholder.com/200"}
                alt={pizza.name}
                className="wishlist-img"
              />
              <h3>{pizza.name}</h3>
              <p>₹{pizza.price}</p>

              <div className="wishlist-actions">
                <button onClick={() => moveToCart(pizza)}>Move to Cart</button>
                <FaTrash
                  className="remove-icon"
                  onClick={() => removeFromWishlist(pizza._id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="empty-wishlist">Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
