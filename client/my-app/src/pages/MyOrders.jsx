// src/pages/MyOrders.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
       const response = await axios.get(
  `${process.env.REACT_APP_API_URL}/api/orders/my-orders`,
  {
          headers: {
            Authorization: `Bearer ${token}`,
          }
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

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Pizza Order Invoice", 14, 20);

    // Order details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
const details = [
  ["Order ID:", order._id],
  ["Order Date:", new Date(order.createdAt).toLocaleString()],
  ["Status:", order.status],
  ["Delivery Address:", order.address || "Not provided"],
  ["Phone:", order.phone || "N/A"], // <-- Added phone here
  ["Payment ID:", order.paymentInfo?.razorpay_payment_id || "N/A"],
];

    let y = 30;
    details.forEach(([label, value]) => {
      doc.text(`${label} ${value}`, 14, y);
      y += 6;
    });

    // Items table
    y += 6;
    autoTable(doc, {
      startY: y,
      head: [["Item", "Size", "Qty", "Price"]],
      body: order.items.map(item => [
        item.name === "custom-pizza" ? "Customized Pizza" : item.name,
        item.size,
        item.quantity,
        `₹${item.price}`
      ]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: ₹${order.totalAmount}`, 14, finalY);

    doc.save(`invoice-${order._id}.pdf`);
  };

  if (loading) return <p className="loading-text">Loading orders...</p>;
  if (orders.length === 0) return <p className="empty-text">You have no past orders.</p>;

  return (
    <div className="my-orders-container">
      <h2 className="my-orders-title">🧾 My Orders</h2>
      <div className="orders-grid">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <p><strong>ID:</strong> {order._id}</p>
              <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
            <p className="order-date">📅 {new Date(order.createdAt).toLocaleString()}</p>
            <p className="order-total">💰 ₹{order.totalAmount}</p>
            <p className="order-address"><strong>Address:</strong> {order.address}</p>
            <p className="order-payment"><strong>Payment ID:</strong> {order.paymentInfo?.razorpay_payment_id || "N/A"}</p>
            <p className="order-phone"><strong>Phone:</strong> {order.phone || "N/A"}</p>

            <ul className="order-items">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name === "custom-pizza" ? "Customized Pizza" : item.name} ({item.size}) × {item.quantity} – ₹{item.price}
                </li>
              ))}
            </ul>
            <button className="invoice-btn" onClick={() => downloadInvoice(order)}>⬇ Download Invoice</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;