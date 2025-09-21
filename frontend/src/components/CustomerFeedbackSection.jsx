import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "The fruits are incredibly fresh and delicious! My family loves the variety in each box.",
    location: "New York, NY",
  },
  {
    name: "Mike Chen",
    rating: 5,
    comment: "Great service and quality. The subscription has made eating healthy so much easier.",
    location: "San Francisco, CA",
  },
  {
    name: "Emily Davis",
    rating: 5,
    comment: "I love how customizable the boxes are. Perfect for my dietary needs and preferences.",
    location: "Austin, TX",
  },
]

export function CustomerFeedbackSection() {
  return (
    <section className="py-12 sm:py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl text-balance">
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-xl text-pretty px-4">
            Join thousands of satisfied customers who have transformed their eating habits with HealthFit.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm sm:text-base leading-relaxed mb-4 text-pretty">"{testimonial.comment}"</p>
                <div className="text-sm">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-muted-foreground">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
