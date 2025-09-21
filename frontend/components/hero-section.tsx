import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-12 sm:py-20 lg:py-32 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 sm:gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-6 sm:space-y-4 text-center lg:text-left">
            <div className="space-y-4 sm:space-y-2">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-5xl xl:text-6xl/none text-balance">
                Healthy Living with <span className="text-primary">HealthFit</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground text-base sm:text-lg md:text-xl text-pretty mx-auto lg:mx-0">
                Discover the perfect blend of nutrition and convenience with our customizable fruit meal boxes. Fresh,
                organic, and delivered right to your doorstep.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:gap-2 min-[400px]:flex-row justify-center lg:justify-start">
              <Button asChild size="lg" className="inline-flex items-center gap-2 h-12 px-6 text-base">
                <Link href="/subscription">
                  Subscribe Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-6 text-base bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center order-first lg:order-last">
            <div className="relative w-full max-w-md lg:max-w-none">
              <img
                src="/fresh-colorful-fruits-and-vegetables-in-a-wooden-b.jpg"
                alt="Fresh fruit meal box"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover w-full lg:aspect-square"
              />
              <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-primary text-primary-foreground p-2 sm:p-4 rounded-full">
                <Leaf className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
