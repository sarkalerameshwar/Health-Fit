// lib/products.ts
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  nutrition: {
    calories?: number
    protein?: number
    fiber?: number
    vitaminC?: number
    potassium?: number
    sugar?: number
  }
  benefits: string[]
  inStock: boolean
  organic: boolean
}

export const products: Product[] = [
  {
    id: "matki",
    name: "Matki (Moth Beans)",
    description: "High-protein, nutritious matki — great for sprouts and dals.",
    price: 0,
    image: "/images/matki.jpg",
    category: "Pulses",
    nutrition: { calories: 343, protein: 23, fiber: 16 },
    benefits: ["High protein", "Good for digestion", "Low glycemic index"],
    inStock: true,
    organic: true,
  },
  {
    id: "banana",
    name: "Banana",
    description: "Sweet, energy-boosting bananas rich in potassium.",
    price: 0,
    image: "/images/banana.jpg",
    category: "Fruits",
    nutrition: { calories: 105, potassium: 422 },
    benefits: ["High potassium", "Quick energy", "Easy to digest"],
    inStock: true,
    organic: false,
  },
  {
    id: "papaya",
    name: "Papaya",
    description: "Tropical papaya — great for digestion and vitamin C.",
    price: 0,
    image: "/images/papaya.jpg",
    category: "Fruits",
    nutrition: { calories: 43, vitaminC: 60 },
    benefits: ["Good for digestion", "Rich in vitamin C"],
    inStock: true,
    organic: true,
  },
  {
    id: "gajar",
    name: "Gajar (Carrot)",
    description: "Crunchy carrots — rich in beta-carotene for eye health.",
    price: 0,
    image: "/images/carrot.jpg",
    category: "Vegetables",
    nutrition: { calories: 41, vitaminC: 5.9 },
    benefits: ["Good for eyesight", "Rich in fiber"],
    inStock: true,
    organic: true,
  },
  {
    id: "mosambi",
    name: "Mosambi (Sweet Lime)",
    description: "Refreshing sweet lime packed with vitamin C.",
    price: 0,
    image: "/images/mosambi.jpg",
    category: "Citrus",
    nutrition: { calories: 30, vitaminC: 50 },
    benefits: ["Hydrating", "High vitamin C"],
    inStock: true,
    organic: false,
  },
  {
    id: "peru",
    name: "Peru (Guava)",
    description: "Fragrant guavas, loaded with fiber and vitamin C.",
    price: 0,
    image: "/images/guava.jpg",
    category: "Fruits",
    nutrition: { calories: 68, fiber: 5.4, vitaminC: 228 },
    benefits: ["Very high vitamin C", "High fiber"],
    inStock: true,
    organic: true,
  },
  {
    id: "dates",
    name: "Dates",
    description: "Natural energy-dense dates — perfect healthy snack.",
    price: 0,
    image: "/images/dates.jpg",
    category: "Dry Fruits",
    nutrition: { calories: 282, fiber: 6.7 },
    benefits: ["Energy-rich", "Good source of iron"],
    inStock: true,
    organic: false,
  },
  {
    id: "dalimb",
    name: "Dalimb (Pomegranate)",
    description: "Juicy pomegranate arils, rich in antioxidants.",
    price: 0,
    image: "/images/pomegranate.jpg",
    category: "Fruits",
    nutrition: { calories: 83, fiber: 4 },
    benefits: ["Antioxidant-rich", "Supports heart health"],
    inStock: true,
    organic: false,
  },
  {
    id: "sprouts",
    name: "Sprouts",
    description: "Fresh homemade sprouts — high in protein and enzymes.",
    price: 0,
    image: "/images/sprouts.jpg",
    category: "Sprouts",
    nutrition: { calories: 30, protein: 3 },
    benefits: ["High protein", "Digestive enzymes"],
    inStock: true,
    organic: true,
  },
  {
    id: "watermelon",
    name: "Watermelon",
    description: "Hydrating watermelon, perfect summer fruit.",
    price: 0,
    image: "/images/watermelon.jpg",
    category: "Fruits",
    nutrition: { calories: 30, potassium: 112 },
    benefits: ["Hydrating", "Low calorie"],
    inStock: true,
    organic: false,
  },
  {
    id: "cucumber",
    name: "Cucumber",
    description: "Crisp cucumbers — cooling and hydrating vegetable.",
    price: 0,
    image: "/images/cucumber.jpg",
    category: "Vegetables",
    nutrition: { calories: 16 },
    benefits: ["Hydrating", "Low calorie"],
    inStock: true,
    organic: true,
  },
  {
    id: "chiku",
    name: "Chiku (Sapota)",
    description: "Sweet chiku fruit with a caramel-like flavor.",
    price: 0,
    image: "/images/chiku.jpg",
    category: "Fruits",
    nutrition: { calories: 83, sugar: 14 },
    benefits: ["Energy-rich", "Good fiber"],
    inStock: true,
    organic: false,
  },
]

export const categories = ["All", "Fruits", "Vegetables", "Pulses", "Dry Fruits", "Sprouts", "Citrus"]
export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}
export function getProductsByCategory(category: string) {
  if (category === "All") return products
  return products.filter((p) => p.category === category)
}
// lib/subscriptions.ts
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  maxItems: number
  popular?: boolean
  features: string[]
  items: string[]   // <-- add this
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "small",
    name: "Small Box",
    description: "Perfect for individuals or couples.",
    price: 1199,
    maxItems: 6,
    popular: false,
    features: ["Fresh seasonal produce", "Free delivery", "Cancel anytime"],
    items: ["matki", "papaya", "gajar/cucumber", "mosambi", "chane", "dates"], // 6 items
  },
  {
    id: "large",
    name: "Large Box",
    description: "Ideal for families who love fresh fruits & veggies.",
    price: 1799,
    maxItems: 8,
    popular: true,
    features: ["More variety", "Free delivery", "Cancel anytime"],
    items: ["2 banana", "papaya", "dates", "mosambi", "sprout", "dalimb", "cucumber", "watermelon"], // 8 items
  },
  
]

