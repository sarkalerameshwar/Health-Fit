import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Subscriptions = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken"); // get JWT token
      if (!token) throw new Error("No token found. Please login.");

      const response = await fetch("https://healthfit-backend.onrender.com/api/orders", {
        headers: {
          authorization: token, // plain token, no 'Bearer ' prefix
        },
        credentials: "include",
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.data.orders)) {
        setOrders(data.data.orders); // set orders array
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">User</th>
            <th className="border px-4 py-2">Plan</th>
            <th className="border px-4 py-2">Payment</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <td className="border px-4 py-2">{order._id}</td>
              <td className="border px-4 py-2">{order.name}</td>
              <td className="border px-4 py-2">{order.plan}</td>
              <td className="border px-4 py-2">{order.paymentMethod}</td>
              <td
                className={`border px-4 py-2 ${
                  order.status === "confirmed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Subscriptions;
