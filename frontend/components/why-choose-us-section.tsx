import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Truck, Heart, Shield } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "All our fruits are certified organic, grown without harmful pesticides or chemicals.",
  },
  {
    icon: Truck,
    title: "Fresh Delivery",
    description: "Farm-to-door delivery ensures maximum freshness and nutritional value.",
  },
  {
    icon: Heart,
    title: "Health Focused",
    description: "Carefully curated selections to support your wellness journey and dietary goals.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "100% satisfaction guarantee with our premium quality assurance standards.",
  },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-balance">
            Why Choose HealthFit?
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl text-pretty">
            We're committed to delivering the highest quality fruits and the best customer experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-pretty">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
