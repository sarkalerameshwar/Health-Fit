"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShippingForm } from "@/components/checkout/shipping-form";
import { PaymentForm } from "@/components/checkout/payment-form";
import { OrderSummaryCard } from "@/components/checkout/order-summary";
import { Loader2, Shield } from "lucide-react";
import type { ShippingAddress, OrderSummary } from "@/lib/checkout";
import { products } from "@/lib/products";
import { createOrder, uploadPaymentProof } from "@/lib/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address: "",
    area: "",
    city: "Nanded",
    confirmAddress: "",
    mobileNumber: "", // Using only mobileNumber
    alternateNumber: "",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("UPI");
  const [upiScreenshot, setUpiScreenshot] = useState<File | null>(null);
  const [upiUTR, setUpiUTR] = useState("");

  useEffect(() => {
    const subscriptionData = localStorage.getItem("healthfit-subscription");
    if (subscriptionData) {
      try {
        const { plan, products: selectedProductIds } =
          JSON.parse(subscriptionData);

        const selectedProducts = selectedProductIds
          .map((productId: string) => {
            const product = products.find((p) => p.id === productId);
            return product
              ? {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                }
              : null;
          })
          .filter(Boolean);

        const subtotal =
          (plan?.price || 0) +
          selectedProducts.reduce(
            (sum: number, product: any) => sum + product.price,
            0
          );
        const shipping = 0; // Free shipping
        const tax = subtotal * 0.0; // 0% tax
        const total = subtotal + shipping + tax;

        setOrderSummary({
          subscriptionPlan: plan,
          selectedProducts,
          subtotal,
          shipping,
          tax,
          total,
        });
      } catch (err) {
        console.error("Error parsing subscription data:", err);
        setError("Unable to load subscription data. Please try again.");
      }
    } else {
      setError(
        "No subscription data found. Please select a subscription plan first."
      );
    }
  }, []);

  const canPlaceOrder = () => {
    return (
      Boolean(shippingAddress.address) &&
      Boolean(shippingAddress.area) &&
      Boolean(shippingAddress.confirmAddress) &&
      Boolean(shippingAddress.mobileNumber) &&
      Boolean(selectedPaymentMethod) &&
      Boolean(orderSummary)
    );
  };

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsPlacingOrder(true);
    setError("");

    try {
      // Save address details and payment method in local storage
      const checkoutData = {
        shippingAddress,
        paymentMethod: selectedPaymentMethod,
        upiUTR,
      };
      localStorage.setItem("healthfit-checkout", JSON.stringify(checkoutData));

      // Prepare order payload
      if (!orderSummary) {
        setError("Order summary is not available");
        return;
      }

      const orderPayload = {
        orderSummary,
        shippingAddress,
        paymentMethod: selectedPaymentMethod,
        UPIScreenshot: upiScreenshot || undefined,
        UPIUTR: upiUTR,
        timestamp: Date.now(),
      };

      console.log('Placing order with payload:', orderPayload);

      // Create order
      await createOrder(orderPayload);
      
      // Clear localStorage after successful order placement
      localStorage.removeItem("healthfit-subscription");
      localStorage.removeItem("healthfit-checkout");
      
      // Redirect to success page
      router.push("/checkout/success");
    } catch (err: any) {
      console.error('Order placement error:', err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!orderSummary && !error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-4 sm:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your order...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !orderSummary) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-4 sm:py-8">
          <div className="text-center px-4">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              className="mt-4"
              onClick={() => router.push("/subscription")}
            >
              Go to Subscription Plans
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8 px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Review your order and place it to start your healthy journey
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Add id so PaymentForm can scroll here when validation fails */}
            <div id="shipping-form">
              <ShippingForm
                shippingAddress={shippingAddress}
                onAddressChange={setShippingAddress}
              />
            </div>

            <PaymentForm
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodChange={setSelectedPaymentMethod}
              isFormValid={canPlaceOrder()}
              upiScreenshot={upiScreenshot}
              onUpiScreenshotChange={setUpiScreenshot}
              upiUTR={upiUTR}
              onUpiUTRChange={setUpiUTR}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 items-center justify-between">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Your payment information is secure and encrypted</span>
              </div>
              
              <Button 
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !canPlaceOrder()}
                className="w-full sm:w-auto"
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
              {orderSummary && <OrderSummaryCard orderSummary={orderSummary} />}

              <div className="p-4 border rounded-lg bg-gradient-to-br from-white/60 to-gray-50 text-center">
                <p className="text-sm font-medium mb-2">Order Total</p>
                <p className="text-2xl font-bold mb-3">
                  ₹{orderSummary?.total.toFixed(2) || "0.00"}
                </p>

                <blockquote className="text-xs italic text-muted-foreground mb-3">
                  “Health is the greatest wealth — thank you for choosing to
                  invest in yourself.”
                </blockquote>

                <div className="mx-auto w-full max-w-[220px]">
                  <img
                    src="/images/checkout-illustration.png"
                    alt="Healthy lifestyle illustration"
                    className="w-full h-auto rounded-md shadow-sm"
                  />
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  Review your order details before placing the order.
                </p>
              </div>

              <div className="text-center">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    alert(
                      "Please review your order details and ensure all information is correct before placing your order."
                    );
                  }}
                >
                  Need help with your order?
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}