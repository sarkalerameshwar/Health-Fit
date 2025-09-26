import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Layout/Header";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  // ✅ Fetch order details
  const fetchOrder = async () => {
    if (!orderId) {
      setError("Order ID is missing");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("You are not authenticated. Please login.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://health-fit-uyi4.onrender.com/api/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        const orderData = data.data || data.order;
        setOrder(orderData);
      } else {
        setError(data.message || "Failed to fetch order details");
        setOrder(null);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // ✅ Confirm order
  const handleConfirmOrder = async () => {
    if (!window.confirm("Are you sure you want to confirm this order?")) return;

    if (!token) {
      alert("You are not authenticated. Please login.");
      return;
    }

    if (!order || !order._id) {
      alert("Order data is not available.");
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const response = await fetch(
        `https://health-fit-uyi4.onrender.com/api/orders/${order._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({
            status: "confirmed",
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Order confirmed successfully!");
        fetchOrder();
      } else {
        throw new Error(data.message || "Failed to confirm order");
      }
    } catch (error) {
      setError(error.message);
      alert(`Error confirming order: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-6">Loading order details...</p>;

  if (error && !order)
    return (
      <div className="min-h-screen overflow-y-auto">
        <Header title="Order Details" />
        <div className="p-6">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={fetchOrder}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen overflow-y-auto">
        <Header title="Order Details" />
        <p className="p-6 text-red-500">Order not found</p>
      </div>
    );

  const showConfirmButton = ["pending_verification"].includes(order.status);

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50">
      <Header title="Order Details" />
      <div className="p-6 space-y-4 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}

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
            <strong>City:</strong> {order.city}
          </div>
          <div>
            <strong>Mobile:</strong> {order.mobileNumber}
          </div>

          {/* ✅ UTR Number */}
          {order.paymentMethod === "Online" && (
            <div>
              <strong>UTR Number:</strong> {order.utrNumber || "-"}
            </div>
          )}

          {/* ✅ Payment Screenshot */}
          {order.paymentMethod === "Online" && (
            <div className="md:col-span-2">
              <strong>Payment Screenshot:</strong>
              {order.paymentScreenshot ? (
                <a
                  href={order.paymentScreenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2"
                >
                  <img
                    src={order.paymentScreenshot}
                    alt="Payment Proof"
                    className="w-64 h-auto border rounded shadow"
                  />
                </a>
              ) : (
                <span className="ml-2">Not uploaded</span>
              )}
            </div>
          )}

          <div>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded ${
                order.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {showConfirmButton && (
          <div className="mt-6 p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold text-lg mb-2">Confirm Order</h3>
            <p className="text-sm text-gray-600 mb-4">
              This order is awaiting verification. Click the button below to
              confirm and activate the subscription.
            </p>
            <button
              onClick={handleConfirmOrder}
              disabled={updating}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {updating ? "Confirming..." : "Confirm Order"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
