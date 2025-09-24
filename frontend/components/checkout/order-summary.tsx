// components/OrderSummaryCard.tsx
"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { OrderSummary } from "@/lib/checkout" // make sure lib/checkout.ts exports this type

interface OrderSummaryProps {
  orderSummary: OrderSummary
}

/** format number to INR currency (returns string like "₹1,234.00") */
function formatINR(value: number) {
  const v = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v)
}

export function OrderSummaryCard({ orderSummary }: OrderSummaryProps) {
  const plan = orderSummary.subscriptionPlan ?? null
  const selected = orderSummary.selectedProducts ?? []
  const subtotal = Number.isFinite(orderSummary.subtotal) ? orderSummary.subtotal : 0
  const shipping = Number.isFinite(orderSummary.shipping) ? orderSummary.shipping : 0
  const tax = Number.isFinite(orderSummary.tax) ? orderSummary.tax : 0
  const total = Number.isFinite(orderSummary.total) ? orderSummary.total : subtotal + shipping + tax

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Subscription Plan */}
        <div>
          <h4 className="font-semibold mb-2">Subscription Plan</h4>

          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/60">
            <div className="min-w-0">
              <div className="font-medium truncate">{plan?.name ?? "No plan selected"}</div>
              {plan?.description && <div className="text-xs text-muted-foreground truncate">{plan.description}</div>}
            </div>

            <div className="text-right ml-4">
              {plan ? (
                plan.price && plan.price > 0 ? (
                  <div className="font-medium">{formatINR(plan.price)}</div>
                ) : (
                  <div className="text-sm text-muted-foreground">Included</div>
                )
              ) : (
                <div className="text-sm text-muted-foreground">—</div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Products */}
        <div>
          <h4 className="font-semibold mb-2">Selected Items</h4>
          <div className="space-y-2">
            {selected.length > 0 ? (
              selected.map((product, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="min-w-0">
                    <div className="truncate">
                      {product.name} <span className="text-muted-foreground">×{product.quantity}</span>
                    </div>
                    {product.note && <div className="text-xs text-muted-foreground truncate">{product.note}</div>}
                  </div>

                  <div className="ml-4">
                    {product.price && product.price > 0 ? (
                      formatINR(product.price * product.quantity)
                    ) : (
                      <span className="text-muted-foreground">Included</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No extra items selected.</div>
            )}
          </div>
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="text-muted-foreground">Free</span> : formatINR(shipping)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatINR(tax)}</span>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-semibold text-lg">{formatINR(total)}</span>
          </div>
        </div>

        {/* Promo / Billing Note */}
        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm font-medium text-primary">Billing</p>
          <p className="text-xs text-muted-foreground">
            {orderSummary.isSubscription
              ? `You'll be charged ${formatINR(total)} every ${orderSummary.billingCycle ?? "month"}. Cancel anytime.`
              : `One-time charge of ${formatINR(total)}.`}
          </p>
        </div>

        {/* Optional small help text */}
        <div className="text-xs text-muted-foreground">
          Need a receipt or invoice? You can update billing details on the checkout page.
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderSummaryCard
