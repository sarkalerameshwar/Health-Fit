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

export default function CheckoutPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null)

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    // state: "",
    // zipCode: "",
    city: "Nanded",
  })

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card")

  useEffect(() => {
    const subscriptionData = localStorage.getItem("healthfit-subscription")
    if (subscriptionData) {
      try {
        const { plan, products: selectedProductIds } = JSON.parse(subscriptionData)

        // Get product details for selected products
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

        // Calculate totals
        const subtotal =
          (plan?.price || 0) + selectedProducts.reduce((sum: number, product: any) => sum + product.price, 0)
        const shipping = 0 // Free shipping
        const tax = subtotal * 0.08 // 8% tax
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
      shippingAddress.firstName &&
      shippingAddress.lastName &&
      shippingAddress.email &&
      shippingAddress.phone &&
      shippingAddress.address &&
      shippingAddress.city &&
      shippingAddress.area &&
      selectedPaymentMethod &&
      orderSummary
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
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const orderData = {
        orderSummary,
        shippingAddress,
        paymentMethod: selectedPaymentMethod,
        orderId: `HF-${Date.now()}`,
        timestamp: Date.now(),
      }
      localStorage.setItem("healthfit-order", JSON.stringify(orderData))

      // Redirect to success page
      router.push("/checkout/success")
    } catch (err) {
      setError("Payment failed. Please try again.")
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
            <ShippingForm shippingAddress={shippingAddress} onAddressChange={setShippingAddress} />
            <PaymentForm
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodChange={setSelectedPaymentMethod}
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

              <Button
                size="lg"
                className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold"
                onClick={handleSubmit}
                disabled={isProcessing || !isFormValid()}
              >
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isProcessing
                  ? "Processing Payment..."
                  : `Complete Order - $${orderSummary?.total.toFixed(2) || "0.00"}`}
              </Button>

              <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">
                By completing your order, you agree to our Terms of Service and Privacy Policy. Your subscription will
                renew monthly.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
