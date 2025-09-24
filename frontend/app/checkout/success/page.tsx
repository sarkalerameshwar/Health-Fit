import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Mail } from "lucide-react"
import Link from "next/link" 

export default function CheckoutSuccessPage() {
  // Mock order data - in real app this would come from the actual order
  const orderDetails = {
    orderNumber: "HF-2024-001234",
    email: "customer@example.com",
    subscriptionPlan: "Medium Box",
    nextDelivery: "January 15, 2024",
    total: 60.97,
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for subscribing to HealthFit. Your healthy journey starts now!
            </p>
          </div>

          {/* Order Details Card */}
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
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-semibold">{orderDetails.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{orderDetails.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subscription Plan</p>
                  <p className="font-semibold">{orderDetails.subscriptionPlan}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Delivery</p>
                  <p className="font-semibold">{orderDetails.nextDelivery}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Paid</span>
                  <span className="text-2xl font-bold text-primary">₹{orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Confirmation Email</p>
                    <p className="text-sm text-muted-foreground">
                      We've sent a confirmation email with your order details and tracking information.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Preparation</p>
                    <p className="text-sm text-muted-foreground">
                      We'll carefully select and pack your fresh fruits according to your preferences.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Your first box will arrive on {orderDetails.nextDelivery}. Enjoy your healthy treats!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </div>

          {/* Support */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Need help? Contact our support team at{" "}
              <Link href="/inquiry" className="text-primary hover:underline">
                support@healthfit.com
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
