import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Truck, Shield, Heart } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "All our fruits are certified organic, grown without harmful pesticides or chemicals.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Fresh fruits delivered to your doorstep within 24-48 hours of harvest.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "We guarantee the freshness and quality of every fruit in your box.",
  },
  {
    icon: Heart,
    title: "Health Focused",
    description: "Carefully curated selections to support your health and wellness goals.",
  },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-12 sm:py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl text-balance">
            Why Choose HealthFit?
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-xl text-pretty px-4">
            We're committed to delivering the highest quality organic fruits to support your healthy lifestyle.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-0 shadow-none">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
