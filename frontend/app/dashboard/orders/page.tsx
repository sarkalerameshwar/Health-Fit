"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Download,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  AlertCircle,
} from "lucide-react";
import Link from "next/link"; // Import Link

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const url = process.env.NEXT_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
          setError("Please log in to view your orders");
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser.userId;

        const response = await fetch(
          `${url}/api/orders/users/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Orders data:", data);

          let ordersArray = [];
          if (Array.isArray(data)) {
            ordersArray = data;
          } else if (data.orders && Array.isArray(data.orders)) {
            ordersArray = data.orders;
          } else if (
            data.data &&
            data.data.orders &&
            Array.isArray(data.data.orders)
          ) {
            ordersArray = data.data.orders;
          } else if (data.data && Array.isArray(data.data)) {
            ordersArray = data.data;
          } else if (data._id || data.plan) {
            ordersArray = [data];
          }

          ordersArray.sort(
            (a, b) =>
              new Date(b.createdAt || b.date).getTime() -
              new Date(a.createdAt || a.date).getTime()
          );

          setOrders(ordersArray);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusInfo = (order: any) => {
    const status = order.status || "pending";
    const endDate = order.subscriptionEnd;
    const now = new Date();

    if (endDate && new Date(endDate) < now && status !== "cancelled") {
      return {
        status: "expired",
        variant: "destructive" as const,
        label: "Expired",
      };
    }

    switch (status.toLowerCase()) {
      case "active":
      case "confirmed":
        return {
          status: "active",
          variant: "default" as const,
          label: "Active",
        };
      case "pending":
      case "pending_verification":
        return {
          status: "pending",
          variant: "secondary" as const,
          label: "Pending",
        };
      case "cancelled":
        return {
          status: "cancelled",
          variant: "destructive" as const,
          label: "Cancelled",
        };
      case "failed":
        return {
          status: "failed",
          variant: "destructive" as const,
          label: "Failed",
        };
      default:
        return {
          status: "unknown",
          variant: "outline" as const,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  const getDaysRemaining = (endDate: string) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription History</h1>
          <p className="text-muted-foreground">
            View and track all your subscription.
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <p className="text-lg font-semibold text-red-600 mb-2">Error</p>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription History</h1>
          <p className="text-muted-foreground">
            View and track all your subscription.
          </p>
        </div>
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't placed any orders yet. Start by exploring our plans.
              </p>
              {/* Fixed Browse Plans button with Link */}
              <Button asChild>
                <Link href="/">Browse Plans</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscription History</h1>
        <p className="text-muted-foreground">
          View and track all your subscription.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => {
          const statusInfo = getStatusInfo(order);
          const daysRemaining = getDaysRemaining(order.subscriptionEnd);
          const planName = order.plan || "Subscription Plan";
          const price = order.planDetails?.price || "0";
          const createdDate = order.createdAt || order.date;

          return (
            <Card
              key={order._id || index}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>{planName}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-1">
                      <span>
                        Ordered on{" "}
                        {createdDate
                          ? new Date(createdDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">₹{price}</p>
                    <Badge variant={statusInfo.variant} className="mt-1">
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {(order.subscriptionStart || order.subscriptionEnd) && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Subscription Period
                      </h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        {order.subscriptionStart && (
                          <div className="flex justify-between items-center p-2 bg-green-50 border border-green-200 rounded">
                            <span className="text-sm font-medium text-green-800">
                              Start Date
                            </span>
                            <span className="text-sm text-green-700">
                              {new Date(
                                order.subscriptionStart
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                        {order.subscriptionEnd && (
                          <div className="flex justify-between items-center p-2 bg-red-50 border border-red-200 rounded">
                            <span className="text-sm font-medium text-red-800">
                              End Date
                            </span>
                            <div className="text-right">
                              <div className="text-sm text-red-700">
                                {new Date(
                                  order.subscriptionEnd
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              {daysRemaining !== null &&
                                statusInfo.status === "active" && (
                                  <div
                                    className={`text-xs ${
                                      daysRemaining > 30
                                        ? "text-green-600"
                                        : daysRemaining > 7
                                        ? "text-orange-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {daysRemaining > 0
                                      ? `${daysRemaining} days left`
                                      : "Expired"}
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Plan Details
                    </h4>
                    <div className="grid gap-2 md:grid-cols-3">
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">Billing Cycle</span>
                        <span className="text-sm font-medium capitalize">
                          {order.planDetails?.billingCycle || "Monthly"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">Payment Method</span>
                        <span className="text-sm font-medium">
                          {order.paymentMethod || "N/A"}
                        </span>
                      </div>
                      {order.utrNumber && (
                        <div className="flex justify-between items-center p-2 bg-muted rounded">
                          <span className="text-sm">UTR Number</span>
                          <span className="text-sm font-mono font-medium">
                            {order.utrNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {(order.address || order.city || order.mobileNumber) && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Contact & Delivery
                      </h4>
                      <div className="p-2 bg-muted rounded">
                        {order.mobileNumber && (
                          <div className="text-sm mb-1">
                            <span className="font-medium">Mobile:</span>{" "}
                            {order.mobileNumber}
                          </div>
                        )}
                        {(order.address || order.city) && (
                          <div className="text-sm">
                            <span className="font-medium">Address:</span>{" "}
                            {order.address}
                            {order.city &&
                              (order.address ? `, ${order.city}` : order.city)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {order.planDetails?.features &&
                    order.planDetails.features.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Plan Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {order.planDetails.features
                            .slice(0, 3)
                            .map((feature: string, idx: number) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          {order.planDetails.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{order.planDetails.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                  {/* <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                    {statusInfo.status === "active" && (
                      <Button variant="outline" size="sm">
                        <Package className="h-4 w-4 mr-2" />
                        Manage Plan
                      </Button>
                    )}
                  </div> */}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}