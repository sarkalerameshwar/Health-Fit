"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { OrderSummaryCard } from "@/components/checkout/order-summary"
import { Loader2, Shield } from "lucide-react"
import type { ShippingAddress, OrderSummary } from "@/lib/checkout"
import { products } from "@/lib/products"
import { createOrder, uploadPaymentProof } from "@/lib/checkout"

export default function CheckoutPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null)

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    phone: "",
    address: "",
    area: "",
    city: "Nanded",
    confirmAddress: "",
    mobileNumber: "",
    alternateNumber: "",
  })

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi")
  const [upiId, setUpiId] = useState("")
  const [upiScreenshot, setUpiScreenshot] = useState<File | null>(null)
  const [upiUTR, setUpiUTR] = useState("")

  useEffect(() => {
    const subscriptionData = localStorage.getItem("healthfit-subscription")
    if (subscriptionData) {
      try {
        const { plan, products: selectedProductIds } = JSON.parse(subscriptionData)

        const selectedProducts = selectedProductIds
          .map((productId: string) => {
            const product = products.find((p) => p.id === productId)
            return product
              ? {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                }
              : null
          })
          .filter(Boolean)

        const subtotal =
          (plan?.price || 0) + selectedProducts.reduce((sum: number, product: any) => sum + product.price, 0)
        const shipping = 0 // Free shipping
        const tax = subtotal * 0.0 // 0% tax (you had comment 8% earlier but code used 0.0)
        const total = subtotal + shipping + tax

        setOrderSummary({
          subscriptionPlan: plan,
          selectedProducts,
          subtotal,
          shipping,
          tax,
          total,
        })
      } catch (err) {
        console.error("Error parsing subscription data:", err)
        setError("Unable to load subscription data. Please try again.")
      }
    } else {
      setError("No subscription data found. Please select a subscription plan first.")
    }
  }, [])

  const isFormValid = () => {
    return (
      Boolean(shippingAddress.address) &&
      Boolean(shippingAddress.area) &&
      Boolean(shippingAddress.confirmAddress) &&
      Boolean(shippingAddress.mobileNumber) &&
      Boolean(selectedPaymentMethod) &&
      Boolean(orderSummary)
    )
  }

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError("Please fill in all required fields")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      // Save address details and payment method in local storage
      const checkoutData = {
        shippingAddress,
        paymentMethod: selectedPaymentMethod,
        upiId,
        upiUTR,
      }
      localStorage.setItem("healthfit-checkout", JSON.stringify(checkoutData))

      // Prepare order payload
      if (!orderSummary) {
        setError("Order summary is not available")
        return
      }

      const orderPayload = {
        orderSummary,
        shippingAddress,
        paymentMethod: selectedPaymentMethod,
        upiId,
        upiUTR,
        orderId: `HF-${Date.now()}`,
        timestamp: Date.now(),
      }

      // Make first backend call: Create order
      const orderResponse = await createOrder(orderPayload)
      const orderId = orderResponse.orderId || orderPayload.orderId

      // Make second backend call: Upload payment proof if UPI
      if (selectedPaymentMethod === "upi" && upiScreenshot) {
        await uploadPaymentProof(orderId, upiScreenshot, upiUTR)
      }

      // Save order data in local storage
      localStorage.setItem("healthfit-order", JSON.stringify({ ...orderPayload, orderId }))

      // Redirect to success page
      router.push("/checkout/success")
    } catch (err) {
      setError("Order placement failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

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
    )
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
            <Button className="mt-4" onClick={() => router.push("/subscription")}>
              Go to Subscription Plans
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8 px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Complete your subscription and start your healthy journey
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Add id so PaymentForm can scroll here when validation fails */}
<div id="shipping-form">
  <ShippingForm shippingAddress={shippingAddress} onAddressChange={setShippingAddress} />
</div>

<PaymentForm
  selectedPaymentMethod={selectedPaymentMethod}
  onPaymentMethodChange={setSelectedPaymentMethod}
  isFormValid={isFormValid()}
  onSubmit={handleSubmit}
  upiId={upiId}
  onUpiIdChange={setUpiId}
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

            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground justify-center lg:justify-start">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>

          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
              {orderSummary && <OrderSummaryCard orderSummary={orderSummary} />}

              {/* Replaced the big "Complete Order" button with a small quote + image card */}
              <div className="p-4 border rounded-lg bg-gradient-to-br from-white/60 to-gray-50 text-center">
                <p className="text-sm font-medium mb-2">Your total</p>
                <p className="text-2xl font-bold mb-3">${orderSummary?.total.toFixed(2) || "0.00"}</p>

                <blockquote className="text-xs italic text-muted-foreground mb-3">
                  “Health is the greatest wealth — thank you for choosing to invest in yourself.”
                </blockquote>

                {/* decorative image: replace src with your asset or an <Image /> component */}
                <div className="mx-auto w-full max-w-[220px]">
                  <img
                    src="/images/checkout-illustration.png"
                    alt="Healthy lifestyle illustration"
                    className="w-full h-auto rounded-md shadow-sm"
                  />
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  Confirm payment from the Payment section above (UPI or COD).
                </p>
              </div>

              {/* kept this small helper in case you still want a programmatic submit on the page */}
              <div className="text-center">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    // optional: if you want a page-level fallback submit
                    // handleSubmit()
                    alert("Please confirm payment from the Payment section above.")
                  }}
                >
                  Need help?
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
