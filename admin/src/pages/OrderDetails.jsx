import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Layout/Header";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("adminToken");

  // Fetch order details from backend
  const fetchOrder = async () => {
    if (!orderId) return;
    if (!token) {
      alert("You are not authenticated. Please login.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          headers: {
            authorization: token, // plain token, no 'Bearer ' prefix
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setOrder(null);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Handle confirming order
  const handleConfirmOrder = async () => {
    if (!window.confirm("Are you sure you want to confirm this order?")) return;
    if (!token) {
      alert("You are not authenticated. Please login.");
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${order._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({ status: "confirmed" }),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Order confirmed successfully!");
        setOrder(data.data);
      } else {
        alert(data.message || "Failed to confirm order");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-6">Loading order details...</p>;
  if (!order) return <p className="p-6 text-red-500">Order not found</p>;

  const isConfirmed = order.status === "confirmed";

  return (
    <div>
      <Header title="Order Details" />
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Name:</strong> {order.name}
          </div>
          <div>
            <strong>Email:</strong> {order.email}
          </div>
          <div>
            <strong>Plan:</strong> {order.plan}
          </div>
          <div>
            <strong>Plan Price:</strong> ₹{order.planDetails?.price || "-"}
          </div>
          <div>
            <strong>Billing Cycle:</strong>{" "}
            {order.planDetails?.billingCycle || "-"}
          </div>
          <div>
            <strong>Subscription Start:</strong>{" "}
            {new Date(order.subscriptionStart).toLocaleDateString()}
          </div>
          <div>
            <strong>Subscription End:</strong>{" "}
            {new Date(order.subscriptionEnd).toLocaleDateString()}
          </div>
          <div>
            <strong>Address:</strong> {order.address}
          </div>
          <div>
            <strong>Confirm Address:</strong> {order.confirmAddress}
          </div>
          <div>
            <strong>City:</strong> {order.city}
          </div>
          <div>
            <strong>Mobile:</strong> {order.mobileNumber}
          </div>
          <div>
            <strong>Alternate Mobile:</strong> {order.alternetNumber || "-"}
          </div>
          <div>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </div>
          <div>
            <strong>Status:</strong>
            <span
              className={`px-2 py-1 rounded ${
                isConfirmed
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status}
            </span>
          </div>

          {order.paymentMethod === "Online" && (
            <>
              <div>
                <strong>UTR Number:</strong> {order.utrNumber || "-"}
              </div>
              <div>
                <strong>Payment Screenshot:</strong>
                {order.paymentScreenshot ? (
                  <a
                    href={order.paymentScreenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={order.paymentScreenshot}
                      alt="Payment"
                      className="w-48 border mt-2"
                    />
                  </a>
                ) : (
                  <span> Not uploaded </span>
                )}
              </div>
            </>
          )}
        </div>

        {!isConfirmed && (
          <button
            onClick={handleConfirmOrder}
            disabled={updating}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {updating ? "Confirming..." : "Confirm Order"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
