"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Smartphone, Truck } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { paymentMethods } from "@/lib/checkout"

interface PaymentFormProps {
  selectedPaymentMethod: string
  onPaymentMethodChange: (methodId: string) => void
  upiScreenshot: File | null
  onUpiScreenshotChange: (file: File | null) => void
  upiUTR: string
  onUpiUTRChange: (upiUTR: string) => void
}

export function PaymentForm({
  selectedPaymentMethod,
  onPaymentMethodChange,
  upiScreenshot,
  onUpiScreenshotChange,
  upiUTR,
  onUpiUTRChange,
}: PaymentFormProps) {
  const [validationMessage, setValidationMessage] = useState("")
  const [copiedVendorUpi, setCopiedVendorUpi] = useState(false)
  const [upiScreenshotFile, setUpiScreenshotFile] = useState<File | null>(null)
  const [upiScreenshotPreview, setUpiScreenshotPreview] = useState<string | null>(null)
  const [localUpiUTR, setLocalUpiUTR] = useState(upiUTR || "")
  const vendorUpi = "9226442954@axl"
  const qrImageUrl = "/images/upi-qr.jpg"

  const handleCopyVendorUpi = async () => {
    try {
      await navigator.clipboard.writeText(vendorUpi)
      setCopiedVendorUpi(true)
      setTimeout(() => setCopiedVendorUpi(false), 2000)
    } catch {
      setValidationMessage("Failed to copy UPI ID. Please copy manually.")
    }
  }

  // Validate UPI payment when fields change
  const validateUpiPayment = () => {
    if (selectedPaymentMethod === "UPI") {
      if (!upiScreenshotFile) {
        return "Please upload the payment screenshot"
      }
      if (!localUpiUTR.trim()) {
        return "Please enter the transaction UTR / reference"
      }
    }
    return ""
  }

  const onUpiScreenshotChangeHandler = (file?: File | null) => {
    if (!file) { 
      setUpiScreenshotFile(null); 
      setUpiScreenshotPreview(null); 
      onUpiScreenshotChange(null);
      setValidationMessage("")
      return; 
    }
    
    const allowed = ["image/png","image/jpeg","image/jpg","image/webp"]
    if (!allowed.includes(file.type)) { 
      setValidationMessage("Only PNG/JPG/WebP allowed."); 
      return; 
    }
    
    if (file.size > 6*1024*1024) { 
      setValidationMessage("Screenshot too large — max 6MB."); 
      return; 
    }
    
    setValidationMessage("")
    setUpiScreenshotFile(file)
    setUpiScreenshotPreview(URL.createObjectURL(file))
    onUpiScreenshotChange(file)
  }

  const clearUpiFields = () => {
    setUpiScreenshotFile(null)
    setUpiScreenshotPreview(null)
    setLocalUpiUTR("")
    setValidationMessage("")
    onUpiScreenshotChange(null)
    onUpiUTRChange("")
  }

  // Auto-validate when UPI fields change
  useEffect(() => {
    const error = validateUpiPayment()
    setValidationMessage(error)
  }, [selectedPaymentMethod, upiScreenshotFile, localUpiUTR])

  // Update localUpiUTR when parent prop changes
  useEffect(() => {
    setLocalUpiUTR(upiUTR || "")
  }, [upiUTR])

  // Update upiScreenshotFile when parent prop changes
  useEffect(() => {
    setUpiScreenshotFile(upiScreenshot)
  }, [upiScreenshot])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {validationMessage && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 text-sm text-red-700 rounded">
            {validationMessage}
          </div>
        )}

        <RadioGroup value={selectedPaymentMethod} onValueChange={onPaymentMethodChange}>
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-2">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex items-center gap-3 cursor-pointer flex-1">
                {method.id === "UPI" ? <Smartphone className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* UPI Payment */}
        {selectedPaymentMethod === "UPI" && (
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="grid gap-4 sm:grid-cols-[300px_1fr] items-start">
              <div className="flex items-center justify-center">
                <img src={qrImageUrl} alt="UPI QR" className="w-48 h-48 object-contain rounded-md bg-white p-2"/>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="vendorUpi">UPI ID (payee)</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <p id="vendorUpi" className="font-medium select-all">{vendorUpi}</p>
                    <Button variant="outline" size="sm" onClick={handleCopyVendorUpi}>
                      {copiedVendorUpi ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scan the QR code or use this UPI ID to make payment
                  </p>
                </div>

                <div>
                  <Label htmlFor="screenshot">Upload payment screenshot *</Label>
                  <Input 
                    id="screenshot"
                    type="file" 
                    accept="image/*" 
                    onChange={e => onUpiScreenshotChangeHandler(e.target.files ? e.target.files[0] : undefined)} 
                    className="text-sm"
                  />
                  <small className="text-xs text-muted-foreground">PNG / JPG, max 6MB</small>
                  {upiScreenshotPreview && (
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">Preview</div>
                      <img src={upiScreenshotPreview} alt="preview" className="w-40 h-40 object-cover rounded-md border"/>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="upiUTR">Transaction UTR / Reference *</Label>
                  <Input 
                    id="upiUTR" 
                    value={localUpiUTR} 
                    onChange={e => {
                      setLocalUpiUTR(e.target.value)
                      onUpiUTRChange(e.target.value)
                    }} 
                    placeholder="Enter UTR / transaction reference number"
                  />
                  <small className="text-xs text-muted-foreground">
                    Find this in your bank app or UPI app transaction history
                  </small>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={clearUpiFields} 
                    variant="outline" 
                    size="sm"
                  >
                    Clear UPI Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cash On Delivery Payment */}
        {selectedPaymentMethod === "COD" && (
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-800">Cash on Delivery Selected</p>
            </div>
            <p className="text-sm text-blue-700">
              You'll pay when you receive your order. Please keep the exact amount ready for our delivery executive.
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• No advance payment required</li>
              <li>• Pay when you receive your products</li>
              <li>• Please have exact change ready</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}