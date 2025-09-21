"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { subscriptionPlans, type SubscriptionPlan } from "@/lib/subscriptions"

interface PlanSelectorProps {
  selectedPlan: SubscriptionPlan | null
  onPlanSelect: (plan: SubscriptionPlan) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
}

/**
 * Helper to compute a marketing "original" price (higher than actual).
 * You can change the multiplier to taste.
 */
function computeOriginalPrice(price: number) {
  const original = price * 1.45 // 45% markup for display
  return Math.round(original * 100) / 100
}

export function PlanSelector({ selectedPlan, onPlanSelect }: PlanSelectorProps) {
  // Filter only small & large plans
  const visiblePlans = subscriptionPlans.filter((p) => p.id === "small" || p.id === "large")

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Choose Your Subscription Plan</h2>
        <p className="text-muted-foreground text-base sm:text-lg px-4 max-w-[760px] mx-auto">
          Select the perfect plan that fits your lifestyle and nutritional needs.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 justify-center">
        {visiblePlans.map((plan) => {
          const originalPriceVal = computeOriginalPrice(plan.price)
          const originalPrice = formatCurrency(originalPriceVal)
          const actualPrice = formatCurrency(plan.price)
          const isSelected = selectedPlan?.id === plan.id

          // Provide an image path — ensure you add these files into /public/images/
          const imageSrc =
            plan.id === "small"
              ? "/fresh-colorful-fruits-and-vegetables-in-wooden-box.jpg"
              : "/fresh-colorful-fruits-and-vegetables-in-wooden-box.jpg"

          return (
            <Card
              key={plan.id}
              onClick={() => onPlanSelect(plan)}
              className={`relative w-full max-w-2xl mx-auto flex flex-col sm:flex-row overflow-hidden cursor-pointer transition-all ${
                isSelected ? "border-primary shadow-lg" : "hover:shadow-lg"
              } ${plan.popular ? "border-primary" : ""}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary hf-badge-float">
                  Most Popular
                </Badge>
              )}

              {/* Image column */}
              <div className="relative w-full sm:w-2/5 h-44 sm:h-auto">
                <Image
                  src={imageSrc}
                  alt={plan.name}
                  fill
                  className="object-cover hf-img-cover"
                  priority={plan.popular} // load popular images earlier
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between sm:w-3/5 p-6">
                <CardHeader className="text-center sm:text-left p-0">
                  <div className="flex items-center justify-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="text-sm">{plan.description}</CardDescription>
                    </div>
                    {/* show selection state on the right on larger screens */}
                    <div className="hidden sm:block">
                      <Button
                        className={`hf-cta px-3 py-1 text-sm ${isSelected ? "bg-primary text-white" : "border"}`}
                        variant={isSelected ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation()
                          onPlanSelect(plan)
                        }}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>

                  {/* Pricing (centered on mobile, left on desktop) */}
                  <div className="mt-4 flex flex-col items-center sm:items-start gap-1">
                    <span className="text-base sm:text-lg text-muted-foreground line-through">
                      {originalPrice}
                    </span>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold text-primary">{actualPrice}</span>
                      <span className="text-sm sm:text-base text-muted-foreground">/month</span>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">Up to {plan.maxItems} items</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  <ul className="space-y-2 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Mobile select CTA */}
                  <div className="sm:hidden">
                    <Button
                      className={`w-full h-10 text-sm ${isSelected ? "bg-primary text-white" : ""}`}
                      variant={isSelected ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation()
                        onPlanSelect(plan)
                      }}
                    >
                      {isSelected ? "Selected" : "Select Plan"}
                    </Button>
                  </div>

                  {/* optional details link */}
                  <div className="text-center sm:text-left">
                    <Link href={`/plans/${plan.id}`} className="text-sm text-muted-foreground hover:text-primary">
                      Learn more
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
