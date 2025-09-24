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
  type: "upi" | "cod"
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
    id: "cod",
    type: "cod",
    name: "Cash on delivery",
    icon: "💰",
    description: "Pay when you receive your order ",
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
  billingCycle?: "month" | "year"
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

export async function createOrder(orderPayload: OrderPayload) {
  const response = await fetch(`${API_BASE_URL}/orders/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(orderPayload),
  })

  if (!response.ok) {
    throw new Error(`Failed to create order: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Upload payment proof (uses email from localStorage)
 * @param file - Payment screenshot
 * @param upiUTR - UPI transaction reference
 */
export async function uploadPaymentProof(file: File, upiUTR: string) {
  const email = localStorage.getItem('userEmail') || ''
  if (!email) throw new Error('User email not found in localStorage.')

  const formData = new FormData()
  formData.append('email', email)
  formData.append('paymentScreenshot', file)
  formData.append('upiUTR', upiUTR)

  const response = await fetch(`${API_BASE_URL}/orders/upload-payment-proof`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to upload payment proof: ${response.statusText}`)
  }

  return response.json()
}
