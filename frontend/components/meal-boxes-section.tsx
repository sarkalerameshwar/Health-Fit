"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

/* Main subscription boxes (only) */
const mealBoxes = [
  {
    id: "mini",
    name: "Mini Box",
    price: "₹1199",
    originalPrice: "₹1299",
    period: "/month",
    description: "Perfect for individuals",
    items: "Up to 6 items",
    features: ["Matki", "Chane", "Cucumber", "Orange", "Dates", "Papaya"],
    image: "/mini-box.jpg",
    popular: false,
  },
  {
    id: "large",
    name: "Large Box",
    price: "₹1799",
    originalPrice: "₹1899",
    period: "/month",
    description: "Great for couples",
    items: "Up to 8 items",
    features: ["Fresh 2 Bananas", "Dates", "Papaya", "Orange pieces", "Cucumber", "Beet"],
    image: "/large-box.jpg",
    popular: true,
  },
]

// helper to parse "₹1199" => 1199 (number)
const parseRupeeString = (s: string) => {
  if (!s) return 0
  const clean = s.replace(/[^\d.]/g, "")
  const n = parseFloat(clean)
  return Number.isNaN(n) ? 0 : n
}

export function MealBoxesSection() {
  const router = useRouter()

  const handleChoosePlan = (box: (typeof mealBoxes)[number]) => {
    const plan = {
      id: box.id ?? box.name,
      name: box.name,
      price: parseRupeeString(box.price),
    }

    const payload = { plan, products: [] }
    localStorage.setItem("healthfit-subscription", JSON.stringify(payload))
    router.push("/checkout")
  }

  return (
    <section id="meal-boxes-section" className="py-12 sm:py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
            Our Meal Boxes
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-xl">
            Choose the perfect subscription plan that fits your lifestyle and nutritional needs.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 justify-center">
          {mealBoxes.map((box, index) => (
            <MealBoxCard key={index} box={box} onChoose={() => handleChoosePlan(box)} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* Reusable card for subscription plans */
function MealBoxCard({
  box,
  onChoose,
}: {
  box: (typeof mealBoxes)[number]
  onChoose: () => void
}) {
  return (
    <Card
      className={`relative w-full max-w-2xl mx-auto flex flex-col sm:flex-row overflow-visible rounded-xl
                  ${box.popular ? "border-primary shadow-lg" : ""}
                  hover:scale-[1.02] hover:shadow-xl transition-all duration-300 ease-in-out`}
    >
      {box.popular && (
        <Badge className="absolute z-10 -top-2 left-1/2 -translate-x-1/2 bg-primary text-xs sm:text-sm">
          Most Popular
        </Badge>
      )}

      <div className="relative z-0 w-full h-48 sm:h-auto sm:w-2/5">
        <Image src={box.image} alt={box.name} fill className="object-cover" />
      </div>

      <div className="flex flex-col justify-between sm:w-3/5 p-4 sm:p-6">
        <CardHeader className="text-center pb-2 sm:pb-4">
          <CardTitle className="text-xl sm:text-2xl">{box.name}</CardTitle>
          <CardDescription className="text-sm">{box.description}</CardDescription>

          <div className="mt-3 sm:mt-4 flex flex-col items-center justify-center gap-1">
            <span className="text-base sm:text-lg text-muted-foreground line-through">{box.originalPrice}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-primary">{box.price}</span>
              <span className="text-sm sm:text-base text-muted-foreground">{box.period}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-2">{box.items}</p>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          <ul className="space-y-2 text-left">
            {box.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          <div>
            <Button
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              variant={box.popular ? "default" : "outline"}
              onClick={onChoose}
            >
              Choose Plan
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
