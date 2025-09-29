"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle } from "lucide-react"

export default function InquiryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    phone: "",
    subject: "",
    category: "",
    message: "",
  })

  const url = process.env.BASE_URL || "http://localhost:5000"

  const [user, setUser] = useState<{ username: string; email: string } | null>(null)

  useEffect(() => {
    // Get email and username from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUser({
          username: parsed.username || parsed.name || "",
          email: parsed.email || "",
        })
      } catch (err) {
        console.error("Error parsing localStorage user:", err)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!user) {
    alert("Please log in first.")
    return
  }

  const token = localStorage.getItem("token")
  if (!token) {
    alert("Please log in first.")
    return
  }

  setIsSubmitting(true)

  try {
    const payload = {
      name: user.username,
      email: user.email,
      phone: formData.phone,
      subject: formData.subject,
      category: formData.category,
      message: formData.message,
    }

    const res = await fetch(`${url}/api/inquiries/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // send plain token
        Authorization: token,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error("Server error:", err)
      throw new Error(err.message || "Failed to submit inquiry")
    }

    setIsSuccess(true)
  } catch (error) {
    console.error("Error submitting inquiry:", error)
    alert("Something went wrong. Please try again.")
  } finally {
    setIsSubmitting(false)
  }
}


  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary">Message Sent!</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <Button onClick={() => setIsSuccess(false)}>Send Another Message</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-balance">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Have questions about our products or services? We're here to help!
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>Fill out the form below and we'll respond as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Inquiry ">General Inquiry</SelectItem>
                          <SelectItem value="Subscription Support">Subscription Support</SelectItem>
                          <SelectItem value="Delivey Issues">Delivery Issues</SelectItem>
                          <SelectItem value="Billing Questions">Billing Questions</SelectItem>
                          <SelectItem value="Product Information">Product Information</SelectItem>
                          <SelectItem value="Technical">Technical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right-hand cards unchanged */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>Other ways to reach us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">healthfit189@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">9226442954</p>
                    <p className="text-sm text-muted-foreground">9657432340</p>
                    <p className="text-sm text-muted-foreground">9699331765</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      Anand Nagar
                      <br />
                      Nanded, 431601
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Mon-Fri: 6AM-10AM
                      <br />
                      Sat-Sun: 6AM-11AM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
                <CardDescription>Quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-sm">How do I change my subscription?</p>
                  <p className="text-xs text-muted-foreground">Visit your dashboard to modify your plan anytime.</p>
                </div>
                <div>
                  <p className="font-medium text-sm">What if I'm not satisfied?</p>
                  <p className="text-xs text-muted-foreground">We offer a 100% satisfaction guarantee.</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Can I pause my subscription?</p>
                  <p className="text-xs text-muted-foreground">No, currently we don't have that feature but you can cantact directly to our service agents.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
