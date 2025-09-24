// lib/checkout.ts
import { getSubscriptionPlan, formatPriceINR } from "./subscriptions"

/* ----------------------
   Types
   ---------------------- */

/** Product line used inside an order summary */
export interface SelectedProduct {
  id: string
  name: string
  price: number // price per unit in whole INR rupees (0 if included)
  quantity: number
  note?: string
}

/** Minimal subscription plan shape used inside checkout */
export interface SubscriptionPlanLite {
  id?: string
  name?: string
  description?: string
  price?: number
}

/** Final shape used by OrderSummaryCard component */
export interface OrderSummary {
  subscriptionPlan?: SubscriptionPlanLite | null
  selectedProducts: SelectedProduct[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  isSubscription?: boolean
  billingCycle?: "month" | "year" | string | undefined
}

/** Shape your QuickOrderSection writes to localStorage */
export interface PendingQuickOrder {
  kind: "quick"
  planId: string
  planName: string
  priceINR: number
  items: string[] // list of item names (or ids). Treated as included items.
  quantity?: number
  createdAt?: number
}

/* ----------------------
   Config (tweak as needed)
   ---------------------- */

export const TAX_RATE = 0.0 // 0 for tax-free demo; set 0.05 for 5% etc.
export const SHIPPING_FLAT = 50 // flat shipping in INR when applicable
export const FREE_SHIPPING_MIN = 1000 // free shipping threshold in INR

/* ----------------------
   Helpers
   ---------------------- */

/** compute shipping based on subtotal */
export function computeShipping(subtotal: number) {
  if (!Number.isFinite(subtotal)) return 0
  return subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FLAT
}

/** compute tax (rounded to nearest rupee) */
export function computeTax(subtotal: number) {
  if (!Number.isFinite(subtotal)) return 0
  return Math.round(subtotal * TAX_RATE)
}

/** compute subtotal from selected products + optional planPrice (plan price included in subtotal) */
export function computeSubtotal(planPrice = 0, items: SelectedProduct[] = []) {
  const itemsTotal = items.reduce((s, p) => s + (Number.isFinite(p.price) ? p.price * p.quantity : 0), 0)
  return Math.round(planPrice + itemsTotal)
}

/** Format number as INR (wrapper around your subscriptions helper) */
export function formatINR(value: number, showDecimals = false) {
  return formatPriceINR(value, showDecimals)
}

/* ----------------------
   Builders
   ---------------------- */

/**
 * Build an OrderSummary from a PendingQuickOrder (what QuickOrderSection writes)
 * - items will be marked with price 0 (included), plan price will be used for subtotal
 */
export function buildOrderFromPendingQuickOrder(pending: PendingQuickOrder): OrderSummary {
  const planPrice = Number.isFinite(Number(pending.priceINR)) ? Number(pending.priceINR) : 0
  const items: SelectedProduct[] = (pending.items || []).map((name, idx) => ({
    id: `${pending.planId}-${idx}`,
    name,
    price: 0,
    quantity: 1,
  }))

  const subtotal = computeSubtotal(planPrice, items)
  const shipping = computeShipping(subtotal)
  const tax = computeTax(subtotal)
  const total = Math.round(subtotal + shipping + tax)

  return {
    subscriptionPlan: {
      id: pending.planId,
      name: pending.planName,
      description: `${pending.planName} (Quick Order)`,
      price: planPrice,
    },
    selectedProducts: items,
    subtotal,
    shipping,
    tax,
    total,
    isSubscription: false,
    billingCycle: undefined,
  }
}

/**
 * Build an OrderSummary from a subscription plan id + optional selected products
 *
 * selectedProducts may be an array of product-like objects; price is per-unit rupees.
 * If you pass product ids only, resolve them before calling this function.
 */
export function buildOrderFromSubscription(planId: string, selectedProducts: SelectedProduct[] = []) : OrderSummary {
  const plan = getSubscriptionPlan(planId)
  const planPrice = plan?.price ?? 0

  const subtotal = computeSubtotal(planPrice, selectedProducts)
  const shipping = computeShipping(subtotal)
  const tax = computeTax(subtotal)
  const total = Math.round(subtotal + shipping + tax)

  return {
    subscriptionPlan: {
      id: plan?.id,
      name: plan?.name,
      description: plan?.description,
      price: planPrice,
    },
    selectedProducts,
    subtotal,
    shipping,
    tax,
    total,
    isSubscription: true,
    billingCycle: "month",
  }
}

/* ----------------------
   LocalStorage helpers for convenience
   ---------------------- */

/** Try to read pendingQuickOrder from localStorage — returns null if not present or invalid */
export function readPendingQuickOrderFromStorage(key = "pendingOrder"): PendingQuickOrder | null {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.kind === "quick") return parsed as PendingQuickOrder
  } catch (e) {
    // ignore parse errors
    console.warn("readPendingQuickOrderFromStorage failed", e)
  }
  return null
}

/** remove pending quick order */
export function clearPendingQuickOrderFromStorage(key = "pendingOrder") {
  try {
    if (typeof window !== "undefined") localStorage.removeItem(key)
  } catch {}
}

/* ----------------------
   Export
   ---------------------- */

export default {
  buildOrderFromPendingQuickOrder,
  buildOrderFromSubscription,
  readPendingQuickOrderFromStorage,
  clearPendingQuickOrderFromStorage,
  computeShipping,
  computeTax,
  computeSubtotal,
  formatINR,
}
