export interface ShippingAddress {
  phone: string
  address: string
  area: string
  city: string
  confirmAddress?: string
  mobileNumber?: string
  alternateNumber?: string
}

export interface PaymentMethod {
  id: string
  type: "upi" | "Cash On Delivery"
  name: string
  icon: string
  description: string
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "upi",
    type: "upi",
    name: "UPI",
    icon: "📱",
    description: "Google Pay, PhonePe, Paytm",
  },
  {
    id: "Cash On Delivery",
    type: "Cash On Delivery",
    name: "Cash on delivery",
    icon: "💰",
    description: "Pay when you receive your order",
  },
]

export interface SelectedProduct {
  id: string
  name: string
  price: number
  quantity: number
  note?: string
}

export interface SubscriptionPlan {
  id?: string
  name?: string
  description?: string
  price?: number
}

export interface OrderSummary {
  subscriptionPlan?: SubscriptionPlan | null
  selectedProducts: SelectedProduct[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  isSubscription?: boolean
  billingCycle?: "month"
}

export interface OrderPayload {
  orderSummary: OrderSummary
  shippingAddress: ShippingAddress
  paymentMethod: string
  upiId?: string
  upiScreenshot?: string
  upiUTR?: string
  orderId?: string
  timestamp?: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

/**
 * Create a new order
 */
export async function createOrder(orderPayload: OrderPayload) {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}") // assume user info stored in localStorage
  if (!token) throw new Error("User not authenticated. Please log in to place an order.")

  // Calculate subscription dates
  const subscriptionStart = new Date()
  const subscriptionEnd = new Date()
  subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1) // 1-month subscription

  const backendPayload = {
    userId: user._id,
    name: user.name,
    email: user.email,
    plan: orderPayload.orderSummary.subscriptionPlan?.name || "Unknown Plan",
    planDetails: {
      price: orderPayload.orderSummary.subscriptionPlan?.price || 0,
      billingCycle: orderPayload.orderSummary.subscriptionPlan?.billingCycle || "monthly",
      features: (orderPayload.orderSummary.subscriptionPlan as any)?.features || [],
    },
    subscriptionStart,
    subscriptionEnd,
    address: orderPayload.shippingAddress.address || "",
    confirmAddress: orderPayload.shippingAddress.confirmAddress || "",
    city: orderPayload.shippingAddress.city || "Nanded",
    mobileNumber: orderPayload.shippingAddress.mobileNumber || "",
    alternetNumber: orderPayload.shippingAddress.alternateNumber || "",
    paymentMethod: orderPayload.paymentMethod,
    upiId: orderPayload.upiId,
    upiUTR: orderPayload.upiUTR,
    timestamp: orderPayload.timestamp || Date.now(),
  }

  const response = await fetch(`${API_BASE_URL}/orders/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(backendPayload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `Failed to create order: ${response.status} ${response.statusText} - ${
        errorData.message || "Unknown error"
      }`
    )
  }

  return response.json()
}


/**
 * Upload payment proof (uses email from localStorage)
 * @param file - Payment screenshot
 * @param upiUTR - UPI transaction reference
 */
export async function uploadPaymentProof(file: File, upiUTR: string) {
  const email = localStorage.getItem("userEmail")
  if (!email) throw new Error("User email not found in localStorage.")

  const formData = new FormData()
  formData.append("email", email)
  formData.append("paymentScreenshot", file)
  formData.append("upiUTR", upiUTR)

  const response = await fetch(`${API_BASE_URL}/orders/upload-payment-proof`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to upload payment proof: ${response.status} ${response.statusText} - ${errorText}`)
  }

  return response.json()
}
