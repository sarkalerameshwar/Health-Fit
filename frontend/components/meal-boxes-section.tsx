import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Image from "next/image"; // ✅ for optimized images in Next.js
import Link from "next/link";

const mealBoxes = [
  {
    name: "Mini Box",
    price: "₹1199",
    originalPrice: "₹1299",
    period: "/month",
    description: "Perfect for individuals",
    items: "Up to 8 items",
    features: [

      "Matki",
      "Chane",
      "cucumber",
      "Orange",
      "dates",
      "Papaya"
    ],
    image: "mini-box.jpg", // ✅ add your image path here
    popular: false,
  },
  {
    name: "Large Box",
    price: "₹1799",
    originalPrice: "₹1899",
    period: "/month",
    description: "Great for couples",
    items: "Up to 6 items",
    features: [
      "Fresh 2 banana",
      "dates",
      "Papaya",
      "Orange pieces",
      "cucumber",
      "beet"
    ],
    image: "large-box.jpg",
    popular: true,
  },
];

export function MealBoxesSection() {
  return (
    <section className="py-12 sm:py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
            Our Meal Boxes
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-xl">
            Choose the perfect subscription plan that fits your lifestyle and
            nutritional needs.
          </p>
        </div>

<div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 justify-center">
  {mealBoxes.map((box, index) => (
    <Card
      key={index}
      className={`relative w-full max-w-2xl mx-auto flex flex-col sm:flex-row overflow-hidden ${
        box.popular ? "border-primary shadow-lg" : ""
      }`}
    >
      {/* Popular Badge */}
      {box.popular && (
        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-xs sm:text-sm">
          Most Popular
        </Badge>
      )}

      {/* Image Section */}
      <div className="relative w-full sm:w-2/5 h-48 sm:h-auto">
        <Image
          src={box.image}
          alt={box.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between sm:w-3/5 p-6">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl sm:text-2xl">{box.name}</CardTitle>
          <CardDescription className="text-sm">{box.description}</CardDescription>

          {/* Pricing */}
          <div className="mt-4 flex flex-col items-center justify-center gap-1">
            <span className="text-base sm:text-lg text-muted-foreground line-through">
              {box.originalPrice}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-primary">
                {box.price}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                {box.period}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            {box.items}
          </p>
        </CardHeader>

        {/* Features + Button */}
        <CardContent className="space-y-4 pt-0">
          <ul className="space-y-2 text-left">
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
            <Link href="/subscription">Choose Plan</Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  ))}
</div>

      </div>
    </section>
  );
}
