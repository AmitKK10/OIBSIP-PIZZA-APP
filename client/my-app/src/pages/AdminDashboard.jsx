// src/pages/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";
import "./AdminDashboard.css";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("http://localhost:55000/api/orders/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [token]);

  if (!stats) return <p className="loading-text">Loading dashboard...</p>;

  const barData = {
    labels: (stats.popularPizzas || []).map((p) => p._id),
    datasets: [
      {
        label: "Orders",
        data: (stats.popularPizzas || []).map((p) => p.count),
        backgroundColor: "#3498db"
      }
    ]
  };

  const pieData = {
    labels: Object.keys(stats.orderStatus || {}),
    datasets: [
      {
        data: Object.values(stats.orderStatus || {}),
        backgroundColor: ["#f39c12", "#27ae60", "#3498db", "#e74c3c"]
      }
    ]
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">📦 Total Orders: <strong>{stats.totalOrders}</strong></div>
        <div className="stat-card">💰 Total Revenue: <strong>₹{stats.totalRevenue}</strong></div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Order Status Distribution</h3>
          <Pie data={pieData} />
        </div>
        <div className="chart-box">
          <h3>Top Ordered Pizzas</h3>
          <Bar data={barData} />
        </div>
      </div>

   </div>
  );
};

export default AdminDashboard;
