export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  joinedDate: string
}

export interface Subscription {
  id: string
  planId: string
  planName: string
  status: "active" | "paused" | "cancelled"
  nextDelivery: string
  price: number
  items: string[]
  startDate: string
}

export interface Order {
  id: string
  orderNumber: string
  date: string
  status: "delivered" | "shipped" | "processing" | "cancelled"
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  total: number
  trackingNumber?: string
}

export interface NutritionGoal {
  id: string
  name: string
  target: number
  current: number
  unit: string
}

// Mock data
export const mockUser: UserProfile = {
  id: "user-1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "/user-avatar.png",
  joinedDate: "2024-01-15",
}

export const mockSubscription: Subscription = {
  id: "sub-1",
  planId: "medium",
  planName: "Medium Box",
  status: "active",
  nextDelivery: "2024-02-15",
  price: 34.99,
  items: ["apple-gala", "banana-organic", "orange-navel", "strawberry-organic"],
  startDate: "2024-01-15",
}

export const mockOrders: Order[] = [
  {
    id: "order-1",
    orderNumber: "HF-2024-001234",
    date: "2024-01-15",
    status: "delivered",
    items: [
      { id: "apple-gala", name: "Gala Apples", quantity: 1, price: 4.99 },
      { id: "banana-organic", name: "Organic Bananas", quantity: 1, price: 3.49 },
      { id: "orange-navel", name: "Navel Oranges", quantity: 1, price: 5.99 },
    ],
    total: 14.47,
    trackingNumber: "TRK123456789",
  },
  {
    id: "order-2",
    orderNumber: "HF-2024-001235",
    date: "2024-01-01",
    status: "delivered",
    items: [
      { id: "strawberry-organic", name: "Organic Strawberries", quantity: 1, price: 6.99 },
      { id: "blueberry-wild", name: "Wild Blueberries", quantity: 1, price: 8.99 },
    ],
    total: 15.98,
    trackingNumber: "TRK123456790",
  },
]

export const mockNutritionGoals: NutritionGoal[] = [
  { id: "calories", name: "Daily Calories", target: 2000, current: 1650, unit: "cal" },
  { id: "protein", name: "Protein", target: 50, current: 42, unit: "g" },
  { id: "fiber", name: "Fiber", target: 25, current: 18, unit: "g" },
  { id: "vitaminC", name: "Vitamin C", target: 90, current: 120, unit: "mg" },
]
