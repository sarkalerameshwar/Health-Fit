"use client"

import { useState } from "react"
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

/* Main subscription boxes (keeps old behaviour) */
const mealBoxes = [
  {
    id: "mini",
    name: "Mini Box",
    price: "₹1199",
    originalPrice: "₹1299",
    period: "/month",
    description: "Perfect for individuals",
    items: "Up to 8 items",
    features: ["Matki", "Chane", "Cucumber", "Orange", "Dates", "Papaya"],
    image: "/mini-box.jpg", // use /public/images/mini-box.jpg
    popular: false,
  },
  {
    id: "large",
    name: "Large Box",
    price: "₹1799",
    originalPrice: "₹1899",
    period: "/month",
    description: "Great for couples",
    items: "Up to 6 items",
    features: ["Fresh 2 Bananas", "Dates", "Papaya", "Orange pieces", "Cucumber", "Beet"],
    image: "/large-box.jpg",
    popular: true,
  },
]

/* Quick demo boxes (one-time trial) */
const demoBoxes = [
  {
    id: "demo-mini",
    name: "Quick Demo Mini",
    price: "₹50",
    originalPrice: "₹70",
    period: "/one-time",
    description: "Sample mini box trial",
    items: "Same as Mini Box",
    features: ["Matki", "Chane", "Cucumber", "Orange", "Dates", "Papaya"],
    image: "/mini-box.jpg",
    popular: false,
  },
  {
    id: "demo-large",
    name: "Quick Demo Large",
    price: "₹80",
    originalPrice: "₹100",
    period: "/one-time",
    description: "Sample large box trial",
    items: "Same as Large Box",
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
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [demoSelected, setDemoSelected] = useState<{ name: string; price: string } | null>(null)

  const handleChoosePlan = (box: (typeof mealBoxes)[number] | (typeof demoBoxes)[number]) => {
    // If this is a demo (id starts with "demo"), show modal with contact info
    if (String(box.id).startsWith("demo")) {
      setDemoSelected({ name: box.name, price: box.price })
      setIsDemoModalOpen(true)
      return
    }

    // Normal subscription flow: build payload and navigate to checkout
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
    <>
      {/* Main subscription section */}
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

      {/* Quick Demo section (small rounded cards) */}
      <section id="quick-demo" className="py-12 sm:py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">Quick Demo Boxes</h2>
            <p className="mx-auto mt-3 sm:mt-4 max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-lg">
              Try a one-time demo of our boxes before subscribing.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 justify-center">
            {demoBoxes.map((box, index) => (
              <Card
                key={index}
                className="flex flex-col items-center text-center p-4 rounded-2xl shadow-sm hover:shadow-md transition bg-white max-w-xs mx-auto"
              >
                <div className="w-28 h-28 relative mb-3">
                  {/* circle image */}
                  <Image src={box.image} alt={box.name} fill className="object-cover rounded-full border-4 border-primary/20" />
                </div>

                <CardHeader className="p-0">
                  <CardTitle className="text-base sm:text-lg">{box.name}</CardTitle>
                  <CardDescription className="text-xs">{box.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 pt-3">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground line-through">{box.originalPrice}</span>
                    <span className="text-xl font-bold text-primary">{box.price}</span>
                    <span className="text-xs text-muted-foreground">{box.period}</span>
                  </div>

                  <Button className="w-full h-8 text-xs rounded-full" onClick={() => handleChoosePlan(box)}>
                    Complete Order
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo modal: appears when user selects a demo box */}
      {isDemoModalOpen && demoSelected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsDemoModalOpen(false)} />

          <div className="relative z-10 w-full max-w-lg bg-card rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">Demo Order — {demoSelected.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">One-time price: <strong className="text-primary">{demoSelected.price}</strong></p>
              </div>

              <button
                onClick={() => setIsDemoModalOpen(false)}
                aria-label="Close demo dialog"
                className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted/60"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 text-sm text-muted-foreground space-y-3">
              <p>If you'd like to place a demo order for this box, please contact us and we'll process it manually.</p>

              <div className="bg-muted/60 p-3 rounded-md">
                <p className="text-sm">Call / WhatsApp: <a className="text-primary font-medium" href="tel:+911234567890">+91 9226442954</a></p>
                <p className="text-sm">Email: <a className="text-primary font-medium" href="mailto:healthfit189@gmail.com">healthfit189@gmail.com</a></p>
              </div>

              <p className="text-xs text-muted-foreground">When you contact us, mention the demo box name so we can prepare it for you.</p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDemoModalOpen(false)}>Close</Button>
              <Button
                onClick={() => {
                  // optionally copy contact number to clipboard and close
                  navigator.clipboard?.writeText("+911234567890").catch(() => {})
                  setIsDemoModalOpen(false)
                  alert("Contact number copied to clipboard. Please message/call us!")
                }}
              >
                Copy Phone & Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* Smaller reusable card for main plans */
function MealBoxCard({
  box,
  onChoose,
}: {
  box: (typeof mealBoxes)[number]
  onChoose: () => void
}) {
  return (
    <Card className={`relative w-full max-w-2xl mx-auto flex flex-col sm:flex-row overflow-hidden rounded-xl ${box.popular ? "border-primary shadow-lg" : ""}`}>
      {box.popular && (
        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-xs sm:text-sm">Most Popular</Badge>
      )}

      <div className="relative w-full sm:w-2/5 h-48 sm:h-auto">
        <Image src={box.image} alt={box.name} fill className="object-cover" />
      </div>

      <div className="flex flex-col justify-between sm:w-3/5 p-6">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl sm:text-2xl">{box.name}</CardTitle>
          <CardDescription className="text-sm">{box.description}</CardDescription>

          <div className="mt-4 flex flex-col items-center justify-center gap-1">
            <span className="text-base sm:text-lg text-muted-foreground line-through">{box.originalPrice}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-primary">{box.price}</span>
              <span className="text-sm sm:text-base text-muted-foreground">{box.period}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-2">{box.items}</p>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <ul className="space-y-2 text-left">
            {box.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          <div>
            <Button className="w-full h-10 sm:h-11 text-sm sm:text-base" variant={box.popular ? "default" : "outline"} onClick={onChoose}>
              Choose Plan
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
