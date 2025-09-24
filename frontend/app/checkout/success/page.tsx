"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Mail } from "lucide-react"
import Link from "next/link"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")
        const user = userData ? JSON.parse(userData) : null
        const userId = user?._id

        if (!token || !userId) {
          setIsLoading(false)
          return
        }

        const res = await fetch(`${API_BASE_URL}/orders/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })

        if (!res.ok) throw new Error(`Request failed: ${res.status}`)

        const data = await res.json()
        console.log("Fetched orders:", data)

        // ✅ new shape: data.data.orders
        const orders = data?.data?.orders || []
        if (orders.length > 0) {
          setOrderDetails(orders[0]) // latest order
        } else {
          setOrderDetails(null)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-12 text-center">
          <p>Loading order details...</p>
        </main>
        <Footer />
      </div>
    )
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
                : "You haven’t placed any order yet."}
            </p>
          </div>

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
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-semibold">{orderDetails.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile Number</p>
                    <p className="font-semibold">{orderDetails.mobileNumber}</p>
                  </div>
                  {orderDetails.alternetNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">Alternate Number</p>
                      <p className="font-semibold">{orderDetails.alternetNumber}</p>
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
                    <span className="text-2xl font-bold text-primary">{orderDetails.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
