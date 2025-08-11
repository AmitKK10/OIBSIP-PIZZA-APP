//src/context/CartContext.jsx

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (item) => {
    setCart((prev) => {
      const updated = [...prev, item];
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
      return updated;
    });
  };

  const removeFromCart = (id) => {
    const updated = cart.filter((i) => i._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const toggleWishlist = (item) => {
    let updated;
    if (wishlist.find((p) => p._id === item._id)) {
      updated = wishlist.filter((p) => p._id !== item._id);
    } else {
      updated = [...wishlist, item];
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <AppContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, toggleWishlist }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
