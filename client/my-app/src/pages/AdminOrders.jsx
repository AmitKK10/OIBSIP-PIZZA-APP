

import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders || []);
        setFilteredOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching admin orders:", error);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingStatusId(id);
    try {
      await axios.put(
  `${process.env.REACT_APP_API_URL}/api/orders/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order status updated!");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
      filterOrders(searchQuery, statusFilter);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Status update failed.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
     await axios.delete(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order deleted successfully.");
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast.error("Order deletion failed.");
    }
  };

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Pizza Order Invoice", 14, 20);

    const customerDetails = [
      ["Customer Name", order.userId?.name || "N/A"],
      ["Email", order.userId?.email || "N/A"],
      ["Phone", order.phone || "N/A"],
      ["Address", order.address || "N/A"],
      ["Order ID", order._id],
      ["Payment ID", order.paymentInfo?.razorpay_payment_id || "N/A"],
      ["Order Date", new Date(order.createdAt).toLocaleString()],
      ["Status", order.status],
    ];

    autoTable(doc, {
      head: [["Customer Detail", "Information"]],
      body: customerDetails,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [50, 50, 50] },
    });

    const itemStartY = doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: itemStartY,
      head: [["Item", "Size", "Qty", "Price"]],
      body: order.items.map((item) => [
        item.name === "custom-pizza" ? "Customized Pizza" : item.name,
        item.size,
        item.quantity,
        `₹${item.price}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
    });

    const totalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: ₹${order.totalAmount}`, 14, totalY);

    doc.save(`invoice-${order._id}.pdf`);
  };

  const filterOrders = (search, status) => {
    let filtered = [...orders];
    if (search) {
      filtered = filtered.filter(
        (o) =>
          o._id.toLowerCase().includes(search.toLowerCase()) ||
          o.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
          o.phone?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status !== "All") {
      filtered = filtered.filter((o) => o.status === status);
    }
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    filterOrders(searchQuery, statusFilter);
  }, [searchQuery, statusFilter, orders]);

  if (loading) return <p className="loading-text">Loading all orders...</p>;

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">📦 Admin Orders</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by Order ID, Email or Phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="orders-table">
        <div className="table-header">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Status</span>
          <span>Total</span>
          <span>Actions</span>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="empty-text">No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="table-row">
              <span>{order._id}</span>
              <span>{order.userId?.email || "Unknown"}</span>
              <span>
                <select
                  disabled={updatingStatusId === order._id}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </span>
              <span>₹{order.totalAmount}</span>
              <span className="action-buttons">
                <button className="invoice-btn" onClick={() => downloadInvoice(order)}>
                  ⬇ Invoice
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteOrder(order._id)}
                >
                  ❌ Delete
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
