"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Leaf } from "lucide-react"
import Link from "next/link"

// Use plain <img> sources from /public
const DEFAULT_IMAGES = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"]

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

  // simple infinite loop logic using clones (first N cloned to end)
  const N = slidesToShow
  const count = images.length
  const cloned = images.slice(0, N)
  const extended = [...images, ...cloned]
  const extendedCount = extended.length

  // auto play
  useEffect(() => {
    if (!autoplay) return
    if (autoRef.current) window.clearInterval(autoRef.current)
    autoRef.current = window.setInterval(() => {
      setPos((p) => p + 1)
    }, autoplayMs)
    return () => {
      if (autoRef.current) {
        window.clearInterval(autoRef.current)
        autoRef.current = null
      }
    }
  }, [autoplay, autoplayMs, slidesToShow])

  // When pos hits clones region, snap back
  useEffect(() => {
    if (pos >= count) {
      // after small delay (allow visible transition), reset to pos - count without transition
      const t = setTimeout(() => {
        if (!trackRef.current) return
        // disable transition
        trackRef.current.style.transition = "none"
        const slideWidth = 100 / slidesToShow
        trackRef.current.style.transform = `translateX(${-(pos - count) * slideWidth}%)`
        // force reflow
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        trackRef.current.offsetHeight
        // restore transition and set pos state
        trackRef.current.style.transition = ""
        setPos((p) => p - count)
      }, 520) // match CSS transition ~500ms
      return () => clearTimeout(t)
    }
  }, [pos, count, slidesToShow])

  // compute translate percent normally
  const slideWidthPercent = 100 / slidesToShow
  const translate = -(pos * slideWidthPercent)

  // controls
  function next() {
    setPos((p) => p + 1)
    resetAutoplay()
  }
  function prev() {
    // handle manual prev when at 0: jump to tail then move to last real
    if (pos === 0) {
      if (!trackRef.current) { setPos((p) => (p - 1 + count) % count); return }
      // snap to clone tail without transition
      const snap = -(count * slideWidthPercent)
      trackRef.current.style.transition = "none"
      trackRef.current.style.transform = `translateX(${snap}%)`
      // force reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      trackRef.current.offsetHeight
      trackRef.current.style.transition = ""
      // then set to last real slide (with transition)
      setTimeout(() => setPos(count - 1), 20)
      resetAutoplay()
      return
    }
    setPos((p) => p - 1)
    resetAutoplay()
  }
  function goTo(i: number) {
    setPos(i)
    resetAutoplay()
  }
  function resetAutoplay() {
    if (!autoplay) return
    if (autoRef.current) window.clearInterval(autoRef.current)
    autoRef.current = window.setInterval(() => {
      setPos((p) => p + 1)
    }, autoplayMs)
  }

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
              <Link href="#meal-boxes-section" className="inline-flex">
                <button className="inline-flex items-center gap-2 h-12 px-6 text-base rounded-md bg-primary text-primary-foreground hover:brightness-95">
                  Subscribe Now <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/learn-more" className="inline-flex">
                <button className="h-12 px-6 text-base rounded-md border border-primary/30 bg-transparent text-black/95 hover:brightness-95">
                  Learn More
                </button>
              </Link>
            </div>
          </div>

          {/* Carousel */}
          <div className="flex items-center justify-center order-first lg:order-last">
            <div className="relative w-full max-w-md lg:max-w-none">
              <div
                className="relative overflow-hidden rounded-xl"
                style={{
                  aspectRatio: slidesToShow === 1 ? "16/9" : undefined,
                  touchAction: "pan-y",
                }}
              >
                {/* track */}
                <div
                  ref={trackRef}
                  className="flex transition-transform duration-500 ease-in-out will-change-transform"
                  style={{
                    width: `${(100 / slidesToShow) * extendedCount}%`,
                    transform: `translateX(${translate}%)`,
                  }}
                >
                  {extended.map((src, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0"
                      style={{ width: `${slideWidthPercent}%`, padding: 8, boxSizing: "border-box" }}
                    >
                      <div
                        className={`relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 h-full ${
                          slidesToShow === 1 ? "aspect-video" : "aspect-[16/10]"
                        }`}
                      >
                        {/* plain <img> for predictable mobile behavior */}
                        <img
                          src={src}
                          alt={`slide-${i}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: slidesToShow === 1 ? "contain" : "cover",
                            objectPosition: "center",
                            display: "block",
                          }}
                          draggable={false}
                          loading={i === 0 ? "eager" : "lazy"}
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

      <style jsx>{`
        img {
          -webkit-user-drag: none;
          user-drag: none;
        }
      `}</style>
    </section>
  )
}
