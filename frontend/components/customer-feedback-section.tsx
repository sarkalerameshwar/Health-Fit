import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    avatar: "/professional-woman-smiling.png",
    rating: 5,
    comment:
      "HealthFit has transformed my eating habits! The fruits are always fresh and the customization options are perfect.",
    initials: "SJ",
  },
  {
    name: "Mike Chen",
    avatar: "/professional-man-smiling.png",
    rating: 5,
    comment:
      "Love the convenience and quality. The nutrition tracking feature helps me stay on top of my health goals.",
    initials: "MC",
  },
  {
    name: "Emily Davis",
    avatar: "/young-woman-smiling.png",
    rating: 5,
    comment: "The variety is amazing! I've discovered so many new fruits I never would have tried otherwise.",
    initials: "ED",
  },
]

export function CustomerFeedbackSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-balance">
            Customer Feedback
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl text-pretty">
            See what our happy customers are saying about their HealthFit experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 text-pretty">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
