//pages/CustomPizzaBuilder.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './CustomPizzaBuilder.css';

// Added: static pizza image
  const pizzaImage =
    "https://plus.unsplash.com/premium_photo-1661762555601-47d088a26b50?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHBpenphfGVufDB8fDB8fHww";

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
  const [favoriteList, setFavoriteList] = useState([]);

useEffect(() => {
  const loadFavorites = () => {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith("favorite_"));
    setFavoriteList(keys);
  };
  loadFavorites();
}, []);

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

  const filterItems = (type) => inventory.filter((item) => item.type === type);

  useEffect(() => {
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
      if (value === 'Pepperoni') toast.info('Try pairing Pepperoni with Mozzarella!');
    } else {
      setState(state.filter((item) => item !== value));
    }
  };

  const handleAddToCart = () => {
    if (!selectedBase || !selectedSauce || !selectedCheese) {
      toast.error('Please select Base, Sauce, and Cheese.');
      return;
    }

   const pizza = {
  name: "Custom Pizza", // so cart shows a name
  base: selectedBase,
  sauce: selectedSauce,
  cheese: selectedCheese,
  veggies: selectedVeggies,
  meat: selectedMeat,
  price,
  quantity: 1, // if your CartContext uses this
  image: "https://plus.unsplash.com/premium_photo-1661762555601-47d088a26b50?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHBpenphfGVufDB8fDB8fHww" // ✅ fixed image
};


    addToCart(pizza);
    toast.success('Pizza added to cart!');
    navigate('/cart');
  };

  const handleReset = () => {
    setSelectedBase('');
    setSelectedSauce('');
    setSelectedCheese('');
    setSelectedVeggies([]);
    setSelectedMeat([]);
    setPrice(0);
  };

  const handleSaveFavorite = () => {
    if (!selectedBase || !selectedSauce || !selectedCheese) {
      toast.error('Select base, sauce & cheese before saving.');
      return;
    }

    const name = prompt('Give your pizza a name:');
    if (!name) return;

    const favorite = {
      name,
      base: selectedBase,
      sauce: selectedSauce,
      cheese: selectedCheese,
      veggies: selectedVeggies,
      meat: selectedMeat,
      price,
    };

    localStorage.setItem(`favorite_${name}`, JSON.stringify(favorite));
    toast.success(`Saved "${name}" to favorites!`);
  };

  return (
    <div className="builder-container">
      <div className="builder-card">
        <h2 className="builder-title">🍕 Build Your Pizza</h2>

        <div className="builder-section">
  <label>Load Favorite Pizza:</label>
  <select
    onChange={(e) => {
      const fav = JSON.parse(localStorage.getItem(e.target.value));
      if (fav) {
        setSelectedBase(fav.base);
        setSelectedSauce(fav.sauce);
        setSelectedCheese(fav.cheese);
        setSelectedVeggies(fav.veggies);
        setSelectedMeat(fav.meat);
      }
    }}
  >
    <option value="">-- Select Favorite --</option>
    {favoriteList.map((key) => (
      <option key={key} value={key}>
        {key.replace("favorite_", "")}
      </option>
    ))}
  </select>
</div>

        <div className="builder-section">
          <label>Base:</label>
          <select value={selectedBase} onChange={(e) => setSelectedBase(e.target.value)}>
            <option value="">-- Select Base --</option>
            {filterItems('base').map((item) => (
              <option key={item._id} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="builder-section">
          <label>Sauce:</label>
          <select value={selectedSauce} onChange={(e) => setSelectedSauce(e.target.value)}>
            <option value="">-- Select Sauce --</option>
            {filterItems('sauce').map((item) => (
              <option key={item._id} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="builder-section">
          <label>Cheese:</label>
          <select value={selectedCheese} onChange={(e) => setSelectedCheese(e.target.value)}>
            <option value="">-- Select Cheese --</option>
            {filterItems('cheese').map((item) => (
              <option key={item._id} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="builder-section">
          <label>Veggies:</label>
          <div className="checkbox-grid">
            {filterItems('veggies').map((item) => (
              <label key={item._id} className="checkbox-pill">
                <input
                  type="checkbox"
                  value={item.name}
                  checked={selectedVeggies.includes(item.name)}
                  onChange={(e) => handleCheckboxChange(e, setSelectedVeggies, selectedVeggies)}
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>

        <div className="builder-section">
          <label>Meat:</label>
          <div className="checkbox-grid">
            {filterItems('meat').map((item) => (
              <label key={item._id} className="checkbox-pill">
                <input
                  type="checkbox"
                  value={item.name}
                  checked={selectedMeat.includes(item.name)}
                  onChange={(e) => handleCheckboxChange(e, setSelectedMeat, selectedMeat)}
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>

        <h3 className="builder-price">Total: ₹{price}</h3>
        <ul className="price-breakdown">
          {selectedBase && <li>Base: ₹50</li>}
          {selectedSauce && <li>Sauce: ₹30</li>}
          {selectedCheese && <li>Cheese: ₹40</li>}
          {selectedVeggies.length > 0 && <li>Veggies: ₹{selectedVeggies.length * 20}</li>}
          {selectedMeat.length > 0 && <li>Meat: ₹{selectedMeat.length * 30}</li>}
        </ul>

        <div className="builder-buttons">
          <button className="reset-btn" onClick={handleReset}>Reset</button>
          <button className="add-btn" onClick={handleAddToCart}>Add to Cart</button>
          <button className="save-btn" onClick={handleSaveFavorite}>❤️ Save</button>
        </div>
      </div>

      {/* Preview panel */}
      <div className="preview-card">
        <h3>🍽️ Preview</h3>
         <img src={pizzaImage} alt="Custom Pizza" style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }} />
        <p><strong>Base:</strong> {selectedBase || 'None'}</p>
        <p><strong>Sauce:</strong> {selectedSauce || 'None'}</p>
        <p><strong>Cheese:</strong> {selectedCheese || 'None'}</p>
        <p><strong>Veggies:</strong> {selectedVeggies.join(', ') || 'None'}</p>
        <p><strong>Meat:</strong> {selectedMeat.join(', ') || 'None'}</p>
      </div>
    </div>
  );
};

export default CustomPizzaBuilder;
