//src/pages/OrderHistory.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import "./OrderHistory.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:55000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Pizza Delivery Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 36);
    doc.text(`Address: ${order.address}`, 14, 42);

    autoTable(doc, {
      startY: 50,
      head: [["Item", "Size", "Qty", "Price"]],
      body: order.items.map((item) => [
        item.name,
        item.size,
        item.quantity,
        `₹${item.price}`,
      ]),
    });

    doc.text(`Total Amount: ₹${order.totalAmount}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save(`Invoice_${order._id}.pdf`);
  };

  if (loading) return <p className="loading-text">Loading orders...</p>;
  if (orders.length === 0) return <p className="empty-orders">You have no past orders.</p>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">🧾 My Orders</h2>
      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <p className="order-id">Order ID: {order._id}</p>
              <p className={`status ${order.status.toLowerCase()}`}>{order.status}</p>
            </div>
            <p className="order-date">
              Placed on: {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="order-address">📍 {order.address}</p>
            <ul className="order-items">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} ({item.size}) × {item.quantity} – ₹{item.price}
                </li>
              ))}
            </ul>
            <p className="order-total">Total: ₹{order.totalAmount}</p>
            <button className="invoice-btn" onClick={() => downloadInvoice(order)}>
              Download Invoice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory;
