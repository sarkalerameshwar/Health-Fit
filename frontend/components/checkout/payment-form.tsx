"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Smartphone, Truck, X } from "lucide-react"

interface PaymentFormProps {
  selectedPaymentMethod: string
  isFormValid: boolean
  upiId: string
  onUpiIdChange: (upiId: string) => void
  upiScreenshot: File | null
  onUpiScreenshotChange: (file: File | null) => void
  upiUTR: string
  onUpiUTRChange: (upiUTR: string) => void
}

/** small helper to convert File -> base64 string */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export function PaymentForm({
  selectedPaymentMethod,
  isFormValid,
  upiId,
  onUpiIdChange,
  upiScreenshot,
  onUpiScreenshotChange,
  upiUTR,
  onUpiUTRChange,
}: PaymentFormProps) {
  const router = useRouter()

  const [validationMessage, setValidationMessage] = useState("")
  const [copiedVendorUpi, setCopiedVendorUpi] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [upiScreenshotFile, setUpiScreenshotFile] = useState<File | null>(null)
  const [upiScreenshotPreview, setUpiScreenshotPreview] = useState<string | null>(null)
  const [localUpiUTR, setLocalUpiUTR] = useState(upiUTR || "")
  const confirmBtnRef = useRef<HTMLButtonElement>(null)

  const vendorUpi = "9226442954@axl"
  const qrImageUrl = "/images/upi-qr.jpg"

  useEffect(() => {
    const orig = document.body.style.overflow
    if (isConfirmModalOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = orig
    return () => { document.body.style.overflow = orig }
  }, [isConfirmModalOpen])

  useEffect(() => {
    if (isConfirmModalOpen && confirmBtnRef.current) confirmBtnRef.current.focus()
  }, [isConfirmModalOpen])

  const scrollToShippingForm = () => {
    const el = document.getElementById("shipping-form")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      el.classList.add("ring-2", "ring-yellow-300")
      setTimeout(() => el.classList.remove("ring-2", "ring-yellow-300"), 1500)
    } else window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCopyVendorUpi = async () => {
    try {
      await navigator.clipboard.writeText(vendorUpi)
      setCopiedVendorUpi(true)
      setTimeout(() => setCopiedVendorUpi(false), 2000)
    } catch {
      setValidationMessage("Failed to copy UPI ID. Please copy manually.")
    }
  }

  const handleConfirmOrder = async () => {
    setIsProcessing(true)
    setValidationMessage("")
    try {
      await new Promise(r => setTimeout(r, 800))
      const subscription = localStorage.getItem("healthfit-subscription")
      const orderSummary = localStorage.getItem("healthfit-order-summary")
      const shipping = localStorage.getItem("healthfit-shipping")
      const orderData = {
        orderSummary: orderSummary ? JSON.parse(orderSummary) : null,
        subscription: subscription ? JSON.parse(subscription) : null,
        shippingAddress: shipping ? JSON.parse(shipping) : null,
        paymentMethod: selectedPaymentMethod,
        upiId: selectedPaymentMethod.toLowerCase() === "upi" ? upiId : undefined,
        upiScreenshot: localStorage.getItem("healthfit-upi-screenshot") ?? undefined,
        upiUTR: localStorage.getItem("healthfit-upi-utr") ?? undefined,
        orderId: `HF-${Date.now()}`,
        timestamp: Date.now(),
      }
      localStorage.setItem("healthfit-order", JSON.stringify(orderData))
      setIsConfirmModalOpen(false)
      router.push("/checkout/success")
    } catch {
      setValidationMessage("Something went wrong. Please try again.")
    } finally { setIsProcessing(false) }
  }

  const handleUploadAndConfirm = async () => {
    setValidationMessage("")
    if (!isFormValid) { setValidationMessage("Please fill all required shipping & order details."); scrollToShippingForm(); return }
    if (!upiScreenshotFile) { setValidationMessage("Please upload the screenshot of the payment."); return }
    if (!localUpiUTR.trim()) { setValidationMessage("Please enter the transaction UTR / reference."); return }

    setIsUploading(true)
    try {
      const base64 = await fileToBase64(upiScreenshotFile)
      localStorage.setItem("healthfit-upi-screenshot", base64)
      localStorage.setItem("healthfit-upi-utr", localUpiUTR.trim())
      await handleConfirmOrder()
    } catch {
      setValidationMessage("Failed to process uploaded screenshot. Try again.")
    } finally { setIsUploading(false) }
  }

  const onCODConfirmClick = () => {
    if (!isFormValid) { setValidationMessage("Please fill all required shipping & order details."); scrollToShippingForm(); return }
    setValidationMessage("")
    setIsConfirmModalOpen(true)
  }

  const onUpiScreenshotChangeHandler = (file?: File | null) => {
    if (!file) { setUpiScreenshotFile(null); setUpiScreenshotPreview(null); return }
    const allowed = ["image/png","image/jpeg","image/jpg","image/webp"]
    if (!allowed.includes(file.type)) { setValidationMessage("Only PNG/JPG/WebP allowed."); return }
    if (file.size > 6*1024*1024) { setValidationMessage("Screenshot too large — max 6MB."); return }
    setValidationMessage("")
    setUpiScreenshotFile(file)
    setUpiScreenshotPreview(URL.createObjectURL(file))
  }

  return (
    <>
      <Card>
        <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {validationMessage && <div className="px-3 py-2 bg-red-50 border border-red-200 text-sm text-red-700 rounded">{validationMessage}</div>}

          {/* UPI */}
          {selectedPaymentMethod.toLowerCase() === "upi" && (
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
                      <Button variant="outline" size="sm" onClick={handleCopyVendorUpi}>{copiedVendorUpi ? "Copied!" : "Copy"}</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Upload payment screenshot</Label>
                    <input type="file" accept="image/*" onChange={e => onUpiScreenshotChangeHandler(e.target.files ? e.target.files[0] : undefined)} className="text-sm"/>
                    <small className="text-xs text-muted-foreground">PNG / JPG, max 6MB</small>
                    {upiScreenshotPreview && <div className="mt-2"><div className="text-xs text-muted-foreground mb-1">Preview</div><img src={upiScreenshotPreview} alt="preview" className="w-40 h-40 object-cover rounded-md border"/></div>}
                  </div>

                  <div>
                    <Label htmlFor="upiUTR">Transaction UTR / Reference</Label>
                    <Input id="upiUTR" value={localUpiUTR} onChange={e => setLocalUpiUTR(e.target.value)} placeholder="Enter UTR / transaction reference"/>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleUploadAndConfirm} variant="default" size="sm" disabled={isUploading || isProcessing}>{isUploading ? "Uploading..." : "Upload & Confirm"}</Button>
                    <Button onClick={() => { setUpiScreenshotFile(null); setUpiScreenshotPreview(null); setLocalUpiUTR(""); setValidationMessage("") }} variant="outline" size="sm">Clear</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COD */}
          {selectedPaymentMethod.toLowerCase() === "cod" && (
            <div className="space-y-4 p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">
                You have selected <strong>Cash on Delivery (COD)</strong>. Please keep the exact amount ready.
              </p>
              <div className="flex gap-2">
                <Button onClick={onCODConfirmClick} variant="default" size="sm" disabled={isProcessing}>Confirm Order</Button>
                <Button onClick={() => setValidationMessage("")} variant="outline" size="sm" disabled={isProcessing}>Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default PaymentForm
