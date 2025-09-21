export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  area: string
  //state: string
  //zipCode: string
  city: string
}

export interface PaymentMethod {
  id: string
  type: "card" | "upi" | "wallet"
  name: string
  icon: string
  description: string
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    type: "card",
    name: "Credit/Debit Card",
    icon: "💳",
    description: "Visa, Mastercard, American Express",
  },
  {
    id: "upi",
    type: "upi",
    name: "UPI",
    icon: "📱",
    description: "Google Pay, PhonePe, Paytm",
  },
  {
    id: "wallet",
    type: "wallet",
    name: "Digital Wallet",
    icon: "💰",
    description: "PayPal, Apple Pay, Google Pay",
  },
]

export interface OrderSummary {
  subscriptionPlan: {
    id: string
    name: string
    price: number
  }
  selectedProducts: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
}
