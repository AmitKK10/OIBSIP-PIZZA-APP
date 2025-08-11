// src/components/CartButton.jsx

import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartButton.css";

const CartButton = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="cart-button" onClick={() => navigate("/cart")}>
      🛒
      {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
    </div>
  );
};

export default CartButton;
