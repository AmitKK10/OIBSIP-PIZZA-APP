// src/pages/AdminInventory.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminInventory.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '', type: '' });
  const [editItemId, setEditItemId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', quantity: '', unit: '', type: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please log in first");
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:55000/api/inventory');
      setInventory(res.data);
    } catch (err) {
      toast.error("Failed to load inventory");
    }
  };

  const handleAdd = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.unit || !newItem.type) {
      toast.error("All fields are required");
      return;
    }
    try {
      await axios.post('http://localhost:55000/api/inventory', newItem);
      toast.success("Item added successfully");
      setNewItem({ name: '', quantity: '', unit: '', type: '' });
      fetchInventory();
    } catch {
      toast.error("Failed to add item");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:55000/api/inventory/${id}`);
      toast.success("Item deleted");
      fetchInventory();
    } catch {
      toast.error("Failed to delete item.");
    }
  };

  const startEditing = (item) => {
    setEditItemId(item._id);
    setEditForm({ name: item.name, quantity: item.quantity, unit: item.unit, type: item.type });
  };

  const cancelEditing = () => {
    setEditItemId(null);
    setEditForm({ name: '', quantity: '', unit: '', type: '' });
  };

  const saveEdit = async (id) => {
    if (!editForm.name || !editForm.quantity || !editForm.unit || !editForm.type) {
      toast.error("All fields must be filled");
      return;
    }
    try {
      await axios.put(`http://localhost:55000/api/inventory/${id}`, editForm);
      toast.success("Item updated");
      setEditItemId(null);
      fetchInventory();
    } catch {
      toast.error("Failed to update item.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? item.type === filterType : true;
    const matchesLowStock = lowStockOnly ? item.quantity < 20 : true;
    return matchesSearch && matchesType && matchesLowStock;
  });

  const groupedInventory = filteredInventory.reduce((groups, item) => {
    const category = item.type || 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="admin-layout">
      <ToastContainer />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h3 className="sidebar-title">Admin Panel</h3>
        <nav>
          <ul>
            <li onClick={() => navigate('/admin-dashboard')}>Dashboard</li>
            <li className="active">Inventory</li>
            <li onClick={() => navigate('/admin-orders')}>Orders</li>
            <li onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>

        <h2 className="title">Admin Inventory</h2>

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            <option value="base">Base</option>
            <option value="sauce">Sauce</option>
            <option value="cheese">Cheese</option>
            <option value="veggies">Veggies</option>
            <option value="meat">Meat</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={() => setLowStockOnly(!lowStockOnly)}
            />
            Low Stock Only
          </label>
        </div>

        {/* Add Item Form */}
        <div className="form-inline">
          <input name="name" placeholder="Name" value={newItem.name} onChange={handleChange} />
          <input name="quantity" type="number" placeholder="Quantity" value={newItem.quantity} onChange={handleChange} />
          <select name="unit" value={newItem.unit} onChange={handleChange}>
            <option value="">Select Unit</option>
            <option value="kg">kg</option>
            <option value="liters">liters</option>
            <option value="pieces">pieces</option>
          </select>
          <select name="type" value={newItem.type} onChange={handleChange}>
            <option value="">Select Type</option>
            <option value="base">Base</option>
            <option value="sauce">Sauce</option>
            <option value="cheese">Cheese</option>
            <option value="veggies">Veggies</option>
            <option value="meat">Meat</option>
          </select>
          <button className="add-btn" onClick={handleAdd}>Add Item</button>
        </div>

        {/* Inventory Display */}
        <div className="inventory-grid">
          {Object.keys(groupedInventory).map((type) => (
            <div key={type}>
              <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
              {groupedInventory[type].map((item) => (
                <div key={item._id} className={`inventory-card ${item.quantity < 20 ? 'low-stock' : ''}`}>
                  {editItemId === item._id ? (
                    <>
                      <input name="name" value={editForm.name} onChange={handleEditChange} />
                      <input name="quantity" type="number" value={editForm.quantity} onChange={handleEditChange} />
                      <select name="unit" value={editForm.unit} onChange={handleEditChange}>
                        <option value="kg">kg</option>
                        <option value="liters">liters</option>
                        <option value="pieces">pieces</option>
                      </select>
                      <select name="type" value={editForm.type} onChange={handleEditChange}>
                        <option value="base">Base</option>
                        <option value="sauce">Sauce</option>
                        <option value="cheese">Cheese</option>
                        <option value="veggies">Veggies</option>
                        <option value="meat">Meat</option>
                      </select>
                      <button className="save-btn" onClick={() => saveEdit(item._id)}>Save</button>
                      <button className="cancel-btn" onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <p><strong>{item.name}</strong> - {item.quantity} {item.unit}</p>
                      <div className="card-actions">
                        <button className="edit-btn" onClick={() => startEditing(item)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
