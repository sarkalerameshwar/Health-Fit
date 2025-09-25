"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Mail, Info, Clock, Phone } from "lucide-react";
import Link from "next/link";

const API_BASE_URL = "https://health-fit-uyi4.onrender.com/api";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        const userId = user?.userId; // <-- use userId, not _id

        if (!token || !userId) {
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/orders/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const data = await res.json();
        console.log("Fetched orders:", data);

        // ✅ new shape: data.data.orders
        const orders = data?.data?.orders || [];
        if (orders.length > 0) {
          setOrderDetails(orders[0]); // latest order
        } else {
          setOrderDetails(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-12 text-center">
          <p>Loading order details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary">
              {orderDetails ? "Order Confirmed!" : "No Active Order"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {orderDetails
                ? "Thank you for subscribing to HealthFit. Your healthy journey starts now!"
                : "You haven't placed any order yet."}
            </p>
          </div>

          {/* Order Confirmation Description */}
          {orderDetails && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-3">
                  <h3 className="font-semibold text-blue-900">
                    Order Confirmation Details
                  </h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        Your order has been placed successfully and is currently
                        being processed.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>
                        You will receive a confirmation email once our team
                        verifies your order details.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>
                        Order verification typically takes 2-4 hours during
                        business days.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>
                        Our team will contact you at {orderDetails.mobileNumber}{" "}
                        if any additional information is required.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {orderDetails && (
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{orderDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{orderDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="font-semibold">{orderDetails.plan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Method
                    </p>
                    <p className="font-semibold">
                      {orderDetails.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Mobile Number
                    </p>
                    <p className="font-semibold">{orderDetails.mobileNumber}</p>
                  </div>
                  {orderDetails.alternetNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Alternate Number
                      </p>
                      <p className="font-semibold">
                        {orderDetails.alternetNumber}
                      </p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-semibold">
                      {orderDetails.address}, {orderDetails.city}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Status</span>
                    <span
                      className={`text-2xl font-bold ${
                        orderDetails.status === "confirmed"
                          ? "text-green-600"
                          : orderDetails.status === "pending"
                          ? "text-orange-600"
                          : orderDetails.status === "active"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {orderDetails.status.charAt(0).toUpperCase() +
                        orderDetails.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps Information */}
          {orderDetails && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">
                What happens next?
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <p className="text-sm font-medium">Order Verification</p>
                  <p className="text-xs text-gray-600">
                    Our team will verify your order details
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold text-green-600">2</span>
                  </div>
                  <p className="text-sm font-medium">Confirmation Email</p>
                  <p className="text-xs text-gray-600">
                    You'll receive order confirmation via email
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold text-purple-600">3</span>
                  </div>
                  <p className="text-sm font-medium">Service Activation</p>
                  <p className="text-xs text-gray-600">
                    Your subscription will be activated
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            {orderDetails && (
              <Button variant="outline" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            )}
            {!orderDetails && (
              <Button asChild variant="outline" size="lg">
                <Link href="/plans">Browse Plans</Link>
              </Button>
            )}
          </div>

          {/* Support Information */}
          {orderDetails && (
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Need help? Contact our support team at{" "}
                <a
                  href="mailto:support@healthfit.com"
                  className="text-primary hover:underline"
                >
                  healthfit189@gmail.com
                </a>{" "}
                or call{" "}
                <a
                  href="tel:+919226442954"
                  className="text-primary hover:underline"
                >
                  +919226442954
                </a>
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
