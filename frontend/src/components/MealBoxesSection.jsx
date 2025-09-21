import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { Link } from "react-router-dom"

const mealBoxes = [
  {
    name: "Small Box",
    price: "Rs.1199",
    originalPrice: "Rs.1299",
    period: "/month",
    description: "Perfect for individuals",
    items: "Up to 3 items",
    features: ["Fresh seasonal fruits", "Nutrition tracking", "Flexible delivery"],
    popular: false,
  },
  {
    name: "Medium Box",
    price: "$34.99",
    originalPrice: "$49.99",
    period: "/month",
    description: "Great for couples",
    items: "Up to 4 items",
    features: ["Fresh seasonal fruits", "Premium organic options", "Nutrition tracking", "Priority support"],
    popular: true,
  },
  {
    name: "Large Box",
    price: "$49.99",
    originalPrice: "$69.99",
    period: "/month",
    description: "Ideal for families",
    items: "Up to 6 items",
    features: [
      "Fresh seasonal fruits",
      "Premium organic options",
      "Exotic fruit varieties",
      "Nutrition tracking",
      "Free delivery",
    ],
    popular: false,
  },
]


export function MealBoxesSection() {
  return (
    <section className="py-12 sm:py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl text-balance">
            Our Meal Boxes
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-xl text-pretty px-4">
            Choose the perfect subscription plan that fits your lifestyle and nutritional needs.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mealBoxes.map((box, index) => (
            <Card key={index} className={`relative ${box.popular ? "border-primary shadow-lg" : ""}`}>
              {box.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-xs sm:text-sm">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl sm:text-2xl">{box.name}</CardTitle>
                <CardDescription className="text-sm">{box.description}</CardDescription>
                <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2">
  <span className="text-lg sm:text-xl text-muted-foreground line-through">
    {box.originalPrice}
  </span>
  <span className="text-3xl sm:text-4xl font-bold text-primary">
    {box.price}
  </span>
  <span className="text-muted-foreground text-sm">{box.period}</span>
</div>

                <p className="text-xs sm:text-sm text-muted-foreground">{box.items}</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <ul className="space-y-2">
                  {box.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  variant={box.popular ? "default" : "outline"}
                >
                  <Link to="/subscription">Choose Plan</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
