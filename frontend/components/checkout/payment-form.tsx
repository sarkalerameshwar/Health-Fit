"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Smartphone, Wallet } from "lucide-react"
import { paymentMethods, type PaymentMethod } from "@/lib/checkout"

interface PaymentFormProps {
  selectedPaymentMethod: string
  onPaymentMethodChange: (methodId: string) => void
}

export function PaymentForm({ selectedPaymentMethod, onPaymentMethodChange }: PaymentFormProps) {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const [upiId, setUpiId] = useState("")

  const getPaymentIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />
      case "upi":
        return <Smartphone className="h-5 w-5" />
      case "wallet":
        return <Wallet className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedPaymentMethod} onValueChange={onPaymentMethodChange}>
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-2">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex items-center gap-3 cursor-pointer flex-1">
                {getPaymentIcon(method.type)}
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Card Payment Form */}
        {selectedPaymentMethod === "card" && (
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={cardDetails.cardholderName}
                onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* UPI Payment Form */}
        {selectedPaymentMethod === "upi" && (
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@paytm"
                required
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your UPI ID to complete the payment. You'll be redirected to your UPI app.
            </p>
          </div>
        )}

        {/* Wallet Payment Form */}
        {selectedPaymentMethod === "wallet" && (
          <div className="space-y-4 p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">
              You'll be redirected to your selected wallet provider to complete the payment.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                PayPal
              </Button>
              <Button variant="outline" size="sm">
                Apple Pay
              </Button>
              <Button variant="outline" size="sm">
                Google Pay
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
