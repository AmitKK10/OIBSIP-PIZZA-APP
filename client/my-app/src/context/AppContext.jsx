// src/context/AppContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  // Persist user session
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const addToWishlist = (item) => {
    setWishlist((prev) => (prev.find((p) => p.id === item.id) ? prev : [...prev, item]));
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        cart,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
