import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function Home() {
  const [pizzas, setPizzas] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceRange, setPriceRange] = useState(500);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get("http://localhost:55000/api/pizza/predefined")
      .then((res) => {
        const pizzasWithExtras = res.data.map((pizza, index) => ({
          ...pizza,
          _id: `pizza-${index}`,
        }));
        setPizzas(pizzasWithExtras);
      })
      .catch((err) => console.error("Failed to fetch pizzas:", err));
  }, []);

  const handleSizeChange = (pizzaId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [pizzaId]: size }));
  };

  const getPriceBySize = (basePrice, size) => {
    if (size === "Medium") return basePrice + 50;
    if (size === "Large") return basePrice + 100;
    return basePrice;
  };

  const handleAddToCart = (pizza) => {
    const selectedSize = selectedSizes[pizza._id] || "Small";
    const updatedPizza = {
      ...pizza,
      size: selectedSize,
      price: getPriceBySize(pizza.price, selectedSize),
    };
    addToCart(updatedPizza);
    toast.success(`${pizza.name} (${selectedSize}) added to cart!`);
    window.dispatchEvent(new Event("cartUpdated")); // ✅ Update cart count in Navbar
  };

  const toggleWishlist = (pizza) => {
    let updatedWishlist;
    if (wishlist.find((item) => item._id === pizza._id)) {
      updatedWishlist = wishlist.filter((item) => item._id !== pizza._id);
      toast.info(`${pizza.name} removed from wishlist`);
    } else {
      updatedWishlist = [...wishlist, pizza];
      toast.success(`${pizza.name} added to wishlist`);
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated")); // ✅ Update wishlist everywhere
  };

  const filteredPizzas = pizzas
    .filter((pizza) =>
      pizza.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((pizza) =>
      categoryFilter === "All" ? true : pizza.category === categoryFilter
    )
    .filter((pizza) => {
      const priceWithSize = getPriceBySize(
        pizza.price,
        selectedSizes[pizza._id] || "Small"
      );
      return priceWithSize <= priceRange;
    })
    .sort((a, b) => {
      if (sortOption === "low-to-high") return a.price - b.price;
      if (sortOption === "high-to-low") return b.price - a.price;
      return 0;
    });

  return (
    <div className="home-container">
      <div className="home-header">
        <h2 className="home-title">Available Pizzas</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search pizzas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="">Sort by</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>

          <div className="price-filter">
            <label>Max Price: ₹{priceRange}</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="pizza-grid">
        {filteredPizzas.map((pizza) => (
          <div key={pizza._id} className="pizza-card">
           

            <div
              className="wishlist-icon"
              onClick={() => toggleWishlist(pizza)}
            >
              {wishlist.find((item) => item._id === pizza._id) ? (
                <FaHeart color="red" size={22} />
              ) : (
                <FaRegHeart color="gray" size={22} />
              )}
            </div>

            <img
              src={pizza.image || "https://via.placeholder.com/200"}
              alt={pizza.name}
              className="pizza-img"
              loading="lazy"
            />

            <h3 className="pizza-name">{pizza.name}</h3>
            <p className="pizza-category">{pizza.category}</p>
            <p className="pizza-price">
              ₹
              {getPriceBySize(
                pizza.price,
                selectedSizes[pizza._id] || "Small"
              )}
            </p>

            <select
              value={selectedSizes[pizza._id] || "Small"}
              onChange={(e) => handleSizeChange(pizza._id, e.target.value)}
              className="size-select"
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium (+₹50)</option>
              <option value="Large">Large (+₹100)</option>
            </select>

            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(pizza)}
            >
              Add to Cart
            </button>
          </div>
        ))}

        {filteredPizzas.length === 0 && (
          <p className="no-results">No pizzas found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
