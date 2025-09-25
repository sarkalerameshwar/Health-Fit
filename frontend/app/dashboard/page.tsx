"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link"; 
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  MapPin,
  User,
} from "lucide-react";

type User = {
  _id: string;
  username: string;
  email: string;
  ifVerified: boolean;
  date: string;
};

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
          setError("Please log in to view your dashboard");
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser.userId; // <-- use userId, not _id or id

        if (!userId) {
          setError("Invalid user data");
          setLoading(false);
          return;
        }

        // Fetch user details
        const userRes = await fetch(`http://localhost:5000/api/user`, {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (!userRes.ok) {
          throw new Error(`User API failed with status: ${userRes.status}`);
        }

        const userData = await userRes.json();

        // Handle user response
        if (userData.user) {
          setUser(userData.user);
        } else if (userData._id) {
          setUser(userData);
        } else if (userData.success && userData.user) {
          setUser(userData.user);
        } else {
          setUser(parsedUser);
        }

        // Fetch orders
        const orderRes = await fetch(
          `http://localhost:5000/api/orders/users/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (orderRes.ok) {
          const ordersData = await orderRes.json();
          console.log("Orders API Response:", ordersData);
          setOrders(ordersData);
        } else {
          console.warn("Orders API failed:", orderRes.status);
          setOrders(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract orders from different response structures
  const getOrdersArray = () => {
    if (!orders) return [];

    if (Array.isArray(orders)) return orders;
    if (orders.orders && Array.isArray(orders.orders)) return orders.orders;
    if (orders.data && orders.data.orders && Array.isArray(orders.data.orders))
      return orders.data.orders;
    if (orders.data && Array.isArray(orders.data)) return orders.data;
    if (orders._id || orders.plan || orders.userId) return [orders];
    if (orders.success && orders.data && Array.isArray(orders.data))
      return orders.data;

    const orderFields = [
      "plan",
      "userId",
      "subscriptionStart",
      "paymentMethod",
      "address",
    ];
    const hasOrderFields = orderFields.some((field) => orders[field]);
    if (hasOrderFields) return [orders];

    return [];
  };

  const ordersList = getOrdersArray();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-lg ml-3">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-semibold text-red-600 mb-2">Error</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username || "User"}!
        </h1>
        <p className="text-gray-600">
          Manage your account and subscription details
        </p>
      </div>

      {/* User Profile Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Account Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold">
                    {user?.username || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email Address
                  </p>
                  <p className="text-lg">{user?.email || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Account Status
                  </p>
                  <div className="flex items-center mt-2">
                    {user?.ifVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-green-600 font-medium">
                          Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                        <span className="text-orange-600 font-medium">
                          Pending Verification
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Member Since
                  </p>
                  <p className="text-lg font-semibold">
                    {user?.date
                      ? new Date(user.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Subscription Details</span>
          </CardTitle>
          <CardDescription>
            Your current plan and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {ordersList.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <CreditCard className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Active Subscription
              </h3>
              <p className="text-gray-500 mb-8">
                Get started by choosing a plan that works for you.
              </p>
              <Button asChild>
                <Link href="/">Browse Plans</Link>
              </Button>
            </div>
          ) : (
            <SubscriptionDetailsCard order={ordersList[0]} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Subscription details component
const SubscriptionDetailsCard = ({ order }: { order: any }) => {
  const getStatusIcon = (status: string) => {
    const s = (status || "pending").toLowerCase();
    switch (s) {
      case "active":
      case "confirmed":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "pending":
      case "pending_verification":
        return <Clock className="h-6 w-6 text-orange-500" />;
      case "cancelled":
      case "failed":
      case "expired":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const s = (status || "pending").toLowerCase();
    switch (s) {
      case "active":
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
      case "pending_verification":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "cancelled":
      case "failed":
      case "expired":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const planName = order.plan || "Subscription Plan";
  const price = order.planDetails?.price || "0";
  const billingCycle = order.planDetails?.billingCycle || "monthly";
  const features = order.planDetails?.features || [];
  const status = order.status || "pending";
  const startDate = order.subscriptionStart;
  const endDate = order.subscriptionEnd;
  const orderId = order._id;
  const paymentMethod = order.paymentMethod || "Not specified";
  const utrNumber = order.utrNumber;
  const address = order.address;
  const city = order.city;
  const mobile = order.mobileNumber;
  const paymentScreenshot = order.paymentScreenshot;
  const createdAt = order.createdAt;

  const getDaysRemaining = () => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          {getStatusIcon(status)}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{planName}</h2>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(
                status
              )}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          </div>
        </div>
        <div className="text-center md:text-right">
          <div className="text-3xl font-bold text-blue-600">₹{price}</div>
          <div className="text-sm text-gray-600 capitalize">{billingCycle}</div>
        </div>
      </div>

      {/* Subscription Timeline */}
      {(startDate || endDate) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {startDate && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Started On
                  </p>
                  <p className="text-lg font-semibold text-green-900">
                    {new Date(startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {endDate && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">Expires On</p>
                  <p className="text-lg font-semibold text-red-900">
                    {new Date(endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {daysRemaining !== null && (
                    <p
                      className={`text-sm font-medium ${
                        daysRemaining > 30
                          ? "text-green-600"
                          : daysRemaining > 7
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {daysRemaining > 0
                        ? `${daysRemaining} days left`
                        : daysRemaining === 0
                        ? "Expires today"
                        : `Expired ${Math.abs(daysRemaining)} days ago`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Plan Features */}
      {features && features.length > 0 && (
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What's Included
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order & Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Details */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Order ID:</span>
              <span className="text-sm font-mono font-medium">
                {orderId || "N/A"}
              </span>
            </div>
            {createdAt && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Order Date:</span>
                <span className="text-sm font-medium">
                  {new Date(createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Payment:</span>
              <span className="text-sm font-medium">{paymentMethod}</span>
            </div>
            {utrNumber && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">UTR:</span>
                <span className="text-sm font-mono font-medium">
                  {utrNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact & Address */}
        {(address || city || mobile) && (
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              {mobile && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Mobile:</span>
                  <span className="text-sm font-medium">{mobile}</span>
                </div>
              )}
              {(address || city) && (
                <div>
                  <span className="text-sm text-gray-500">Address:</span>
                  <p className="text-sm font-medium mt-1">
                    {address}
                    {city && address ? `, ${city}` : city}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Payment Screenshot */}
      {paymentScreenshot && (
        <div className="p-6 border rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Confirmation
          </h3>
          <img
            src={paymentScreenshot}
            alt="Payment confirmation"
            className="max-w-sm h-auto rounded-lg border shadow-md mx-auto"
          />
        </div>
      )}
    </div>
  );
};
