// lib/subscriptions.ts
export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  maxItems: number
  description: string
  features: string[]
  popular: boolean
  /** Optional relative path to an image in /public/images (e.g. '/images/small-box.jpg') */
  image?: string
}

/**
 * All canonical subscription plans.
 * Keep prices as numbers — formatting is done at display time.
 */
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "small",
    name: "Small Box",
    price:1199,
    maxItems: 3,
    description: "Perfect for individuals",
    features: ["Fresh seasonal fruits", "Nutrition tracking", "Flexible delivery"],
    popular: false,
    image: "/fresh-colorful-fruits-and-vegetables-in-a-wooden-b.jpg",
  },
  {
    id: "medium",
    name: "Medium Box",
    price: 1799,
    maxItems: 4,
    description: "Great for couples",
    features: [
      "Fresh seasonal fruits",
      "Premium organic options",
      "Nutrition tracking",
      "Priority support",
    ],
    popular: true,
    image: "/fresh-colorful-fruits-and-vegetables-in-a-wooden-b.jpg",
  },
  {
    id: "large",
    name: "Large Box",
    price: 1799,
    maxItems: 6,
    description: "Ideal for families",
    features: [
      "Fresh seasonal fruits",
      "Premium organic options",
      "Exotic fruit varieties",
      "Nutrition tracking",
      "Free delivery",
    ],
    popular: true,
    image: "/fresh-colorful-fruits-and-vegetables-in-wooden-box.jpg",
  },
]

/**
 * Compute a marketing "original" price (higher than actual) for display.
 * Keep logic here so UI and tests use the same rule.
 *
 * You can tweak the multiplier or rounding here.
 */
export function computeOriginalPrice(price: number, multiplier = 1.45): number {
  const original = price * multiplier
  // round to 2 decimals
  return Math.round(original * 100) / 100
}

/**
 * Helper to format number price to a localized currency string.
 * UI can still use its own formatter, but exporting here centralizes formatting.
 */
export function formatPriceUSD(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
}

/**
 * Return a subset of plans for display on the marketing grid.
 * By default we return only small & large (like the UI requested),
 * but callers can pass an array of ids to include.
 */
export function getPlansForDisplay(allowedIds: string[] = ["small", "large"]): SubscriptionPlan[] {
  return subscriptionPlans.filter((p) => allowedIds.includes(p.id))
}

/**
 * Find plan by id
 */
export function getSubscriptionPlan(id: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find((plan) => plan.id === id)
}
