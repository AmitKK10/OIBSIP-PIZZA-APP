// src/pages/CustomPizzaBuilder.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CustomPizzaBuilder = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedSauce, setSelectedSauce] = useState('');
  const [selectedCheese, setSelectedCheese] = useState('');
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [selectedMeat, setSelectedMeat] = useState([]);

  const [price, setPrice] = useState(0);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get('http://localhost:55000/api/inventory');
        setInventory(res.data);
      } catch (err) {
        console.error('Error fetching inventory', err);
      }
    };
    fetchInventory();
  }, []);

  // Categorize items
  const filterItems = (type) => inventory.filter((item) => item.type === type);

  useEffect(() => {
    // Example price calculation
    let total = 0;
    if (selectedBase) total += 50;
    if (selectedSauce) total += 30;
    if (selectedCheese) total += 40;
    total += selectedVeggies.length * 20;
    total += selectedMeat.length * 30;
    setPrice(total);
  }, [selectedBase, selectedSauce, selectedCheese, selectedVeggies, selectedMeat]);

  const handleCheckboxChange = (e, setState, state) => {
    const { value, checked } = e.target;
    if (checked) {
      setState([...state, value]);
    } else {
      setState(state.filter((item) => item !== value));
    }
  };

  const handleAddToCart = () => {
    const pizza = {
      base: selectedBase,
      sauce: selectedSauce,
      cheese: selectedCheese,
      veggies: selectedVeggies,
      meat: selectedMeat,
      price,
    };
    addToCart(pizza);
    navigate('/cart');
  };

  return (
    <div style={{ padding: '2rem', background: '#fff6f0', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>🍕 Build Your Pizza</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Base:</label>
        <select value={selectedBase} onChange={(e) => setSelectedBase(e.target.value)}>
          <option value="">-- Select Base --</option>
          {filterItems('base').map((item) => (
            <option key={item._id} value={item.name}>{item.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Sauce:</label>
        <select value={selectedSauce} onChange={(e) => setSelectedSauce(e.target.value)}>
          <option value="">-- Select Sauce --</option>
          {filterItems('sauce').map((item) => (
            <option key={item._id} value={item.name}>{item.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Cheese:</label>
        <select value={selectedCheese} onChange={(e) => setSelectedCheese(e.target.value)}>
          <option value="">-- Select Cheese --</option>
          {filterItems('cheese').map((item) => (
            <option key={item._id} value={item.name}>{item.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Veggies:</label>
        {filterItems('veggie').map((item) => (
          <div key={item._id}>
            <input
              type="checkbox"
              value={item.name}
              checked={selectedVeggies.includes(item.name)}
              onChange={(e) => handleCheckboxChange(e, setSelectedVeggies, selectedVeggies)}
            />
            <label>{item.name}</label>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Meat:</label>
        {filterItems('meat').map((item) => (
          <div key={item._id}>
            <input
              type="checkbox"
              value={item.name}
              checked={selectedMeat.includes(item.name)}
              onChange={(e) => handleCheckboxChange(e, setSelectedMeat, selectedMeat)}
            />
            <label>{item.name}</label>
          </div>
        ))}
      </div>

      <h3>Total Price: ₹{price}</h3>

      <button
        onClick={handleAddToCart}
        style={{
          padding: '10px 20px',
          backgroundColor: 'orange',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default CustomPizzaBuilder;
