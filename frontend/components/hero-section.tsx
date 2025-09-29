"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Zap, Leaf } from "lucide-react"

import Link from "next/link"
import Image from "next/image" // Use Next.js Image component for better optimization
import { TypingText } from "./TypingText" // keep your typing component import

// plain images from /public
const DEFAULT_IMAGES = ["/fruit-im.jpg", "/fruit1.jpg", "/hero3.jpg"]

export function HeroSection({
  images = DEFAULT_IMAGES,
  autoplay = true,
  autoplayMs = 3500,
}: {
  images?: string[]
  autoplay?: boolean
  autoplayMs?: number
}) {
  const [pos, setPos] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(1)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const autoRef = useRef<number | null>(null)

  useEffect(() => {
    function calc() {
      const w = window.innerWidth
      if (w >= 1280) setSlidesToShow(3)
      else if (w >= 768) setSlidesToShow(2)
      else setSlidesToShow(1)
    }
    calc()
    window.addEventListener("resize", calc)
    return () => window.removeEventListener("resize", calc)
  }, [])

  const N = slidesToShow
  const count = images.length
  const cloned = images.slice(0, N)
  const extended = [...images, ...cloned]
  const extendedCount = extended.length
  const slidePct = 100 / slidesToShow
  const translate = -(pos * slidePct)

  // autoplay
  useEffect(() => {
    if (!autoplay) return
    if (autoRef.current) window.clearInterval(autoRef.current)
    autoRef.current = window.setInterval(() => setPos((p) => p + 1), autoplayMs)
    return () => {
      if (autoRef.current) {
        window.clearInterval(autoRef.current)
        autoRef.current = null
      }
    }
  }, [autoplay, autoplayMs, slidesToShow])

  // snap when hitting clones
  useEffect(() => {
    if (pos >= count) {
      const t = setTimeout(() => {
        if (!trackRef.current) return
        trackRef.current.style.transition = "none"
        const snap = -(pos - count) * slidePct
        trackRef.current.style.transform = `translateX(${snap}%)`
        trackRef.current.offsetHeight // force reflow
        setPos((p) => p - count)
        trackRef.current.style.transition = ""
      }, 520)
      return () => clearTimeout(t)
    }
  }, [pos, count, slidePct])

  function next() {
    setPos((p) => p + 1)
    resetAuto()
  }
  function prev() {
    if (pos === 0) {
      if (trackRef.current) {
        trackRef.current.style.transition = "none"
        const snap = -count * slidePct
        trackRef.current.style.transform = `translateX(${snap}%)`
        trackRef.current.offsetHeight // force reflow
        trackRef.current.style.transition = ""
        setTimeout(() => setPos(count - 1), 20)
        resetAuto()
        return
      }
    }
    setPos((p) => Math.max(0, p - 1))
    resetAuto()
  }
  function goTo(i: number) {
    setPos(i)
    resetAuto()
  }
  function resetAuto() {
    if (!autoplay) return
    if (autoRef.current) window.clearInterval(autoRef.current)
    autoRef.current = window.setInterval(() => setPos((p) => p + 1), autoplayMs)
  }

  const isMobile = slidesToShow === 1

  // Smooth scroll helpers for CTAs
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      // small focus ring so it's visible
      el.classList.add("ring-2", "ring-primary/40")
      setTimeout(() => el.classList.remove("ring-2", "ring-primary/40"), 1400)
    } else {
      // fallback: anchor navigation
      window.location.hash = id
    }
  }

  return (
    <section className="relative py-12 sm:py-20 lg:py-32 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 sm:gap-6 lg:grid-cols-[1fr_420px] lg:gap-12 xl:grid-cols-[1fr_650px]">
          {/* left content */}
          <div className="flex flex-col justify-center space-y-6 sm:space-y-4 text-center lg:text-left">
            <div className="space-y-4 sm:space-y-2">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-5xl xl:text-6xl/none text-balance">
  Healthy Living with
  <span className="block">
    <TypingText
      texts={["HealthFit", "Fresh Meals", "Organic Life"]}
      className="text-primary"
      speed={100}
      deleteSpeed={60}
      pause={1500}
    />
  </span>
</h1>


              <p className="max-w-[700px] text-muted-foreground text-base sm:text-lg md:text-xl text-pretty mx-auto lg:mx-0">
                Discover the perfect blend of nutrition and convenience with our customizable fruit meal boxes.
                Each box is curated with fresh, organic, and delicious ingredients, designed to boost your energy
                and simplify your healthy lifestyle. Delivered right to your doorstep.
              </p>
            </div>

            {/* Creative CTA layout */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start">
              {/* Primary: Subscribe - matches existing behaviour but uses smooth scroll helper */}
              <button
                onClick={() => scrollToSection("meal-boxes-section")}
                className="inline-flex items-center gap-2 h-12 px-6 text-base rounded-md bg-primary text-primary-foreground hover:brightness-95 shadow-sm"
                aria-label="Subscribe now - scroll to meal boxes"
              >
                Subscribe Now
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Secondary: Quick Demo - visually distinct, includes small price hint */}
              <button
                onClick={() => scrollToSection("DemoBoxesSection")}
                className="inline-flex items-center gap-3 h-12 px-4 text-base rounded-md border border-primary/20 bg-white/90 text-primary hover:bg-primary/5 shadow-sm"
                aria-label="Quick Demo - scroll to quick demo boxes"
              >
                <span className="flex flex-col text-left leading-tight">
                  <span className="text-sm font-medium">Quick Demo</span>
                  <span className="text-xs text-muted-foreground">One-time ₹59 / ₹99</span>
                </span>
                <span className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground p-2">
                  <Zap className="h-4 w-4" />
                </span>
              </button>

              {/* Tertiary: Learn more - link to page */}
             <Link href="/learn-more" className="inline-flex"> <button className="h-12 px-6 text-base rounded-md border border-primary/30 bg-transparent text-black/95 hover:brightness-95"> Learn More </button> </Link>

            </div>
          </div>

          {/* carousel - FIXED */}
          <div className="flex items-center justify-center order-first lg:order-last">
            <div className="relative w-full max-w-md lg:max-w-none">
              <div
                className="relative overflow-hidden rounded-xl"
                style={{
                  // Use consistent aspect ratio for all screen sizes
                  aspectRatio: isMobile ? "4/3" : "16/10",
                  maxHeight: isMobile ? "400px" : "none",
                }}
              >
                <div
                  ref={trackRef}
                  className="flex transition-transform duration-500 ease-in-out will-change-transform h-full"
                  style={{
                    width: `${(100 / slidesToShow) * extendedCount}%`,
                    transform: `translateX(${translate}%)`,
                  }}
                >
                  {extended.map((src, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 h-full"
                      style={{ width: `${slidePct}%`, padding: 8, boxSizing: "border-box" }}
                    >
                      <div
                        className="relative overflow-hidden rounded-xl"
                        style={{
                          aspectRatio: "4/3",
                          maxHeight: "400px",
                        }}
                      >
                        <Image
                          src={src}
                          alt={`slide-${idx}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{
                            objectFit: "contain",
                            objectPosition: "center",
                          }}
                          draggable={false}
                          priority={idx === 0}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 p-2 hover:bg-black/50 text-white"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 p-2 hover:bg-black/50 text-white"
                >
                  ›
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`h-2 w-8 rounded-full transition-all ${i === (pos % count) ? "bg-primary" : "bg-white/40"}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

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
