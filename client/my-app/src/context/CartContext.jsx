// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Load cart and wishlist from localStorage initially
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setCartItems(storedCart);
    setWishlist(storedWishlist);
  }, []);

  // Helper to update localStorage and dispatch event
  const updateCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateWishlist = (updatedWishlist) => {
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // Cart Functions
  const addToCart = (pizza) => {
    const existingIndex = cartItems.findIndex(
      (item) => item._id === pizza._id && item.size === pizza.size
    );

    let updatedCart;
    if (existingIndex !== -1) {
      updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart = [...cartItems, { ...pizza, quantity: 1 }];
    }

    updateCart(updatedCart);
  };

  const removeFromCart = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    updateCart(updated);
  };

  const increaseQuantity = (index) => {
    const updated = [...cartItems];
    updated[index].quantity += 1;
    updateCart(updated);
  };

  const decreaseQuantity = (index) => {
    const updated = [...cartItems];
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
    } else {
      updated.splice(index, 1);
    }
    updateCart(updated);
  };

  const clearCart = () => {
    updateCart([]);
  };

  // Wishlist Functions
  const addToWishlist = (pizza) => {
    const exists = wishlist.some((item) => item._id === pizza._id);
    if (!exists) {
      const updated = [...wishlist, pizza];
      updateWishlist(updated);
    }
  };

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item._id !== id);
    updateWishlist(updated);
  };

  const toggleWishlist = (pizza) => {
    const exists = wishlist.find((item) => item._id === pizza._id);
    exists ? removeFromWishlist(pizza._id) : addToWishlist(pizza);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlist,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
