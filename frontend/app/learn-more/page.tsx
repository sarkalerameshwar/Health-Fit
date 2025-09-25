"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// lucide-react icons — we'll provide safe fallbacks in case any import is undefined
import {
  Leaf,
  Check as SeedlingIconImport,
  Package as PackageIconImport,
  Truck as TruckIconImport,
  CheckCircle as CheckCircleIconImport,
  Users as UsersIconImport,
  Clock as ClockIconImport,
} from "lucide-react"

/* ------------------------
   Small fallback wrapper:
   If an icon import is undefined for some reason, we render a tiny inline SVG so the app won't crash.
   ------------------------ */
function IconFallback({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", width: 20, height: 20, alignItems: "center", justifyContent: "center" }}>
      {children}
    </span>
  )
}

function SafeIcon({ Comp, className = "h-5 w-5" }: { Comp?: any; className?: string }) {
  if (Comp) return <Comp className={className} />
  // tiny neutral circle fallback
  return (
    <IconFallback>
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </IconFallback>
  )
}

/* ------------------------
   Page
   ------------------------ */
export default function LearnMorePage() {
  // use the imported icons (may be undefined if the icon name doesn't exist)
  const Seedling = SeedlingIconImport
  const PackageIcon = PackageIconImport
  const Truck = TruckIconImport
  const CheckCircle = CheckCircleIconImport
  const Users = UsersIconImport
  const Clock = ClockIconImport

  const quickStats = [
    { icon: <SafeIcon Comp={Seedling} />, label: "Local farms", value: "35+" },
    { icon: <SafeIcon Comp={PackageIcon} />, label: "Boxes packed / day", value: "400+" },
    { icon: <SafeIcon Comp={Truck} />, label: "Cities served", value: "12" },
    { icon: <SafeIcon Comp={CheckCircle} />, label: "Satisfaction", value: "4.8/5" },
  ]

  const timeline = [
    {
      step: 1,
      title: "Sourcing from Trusted Farmers",
      desc:
        "We partner with local farms using responsible growing practices — seasonal, organic where possible, and selected for taste & nutrition.",
      img: "/images/1.png",
      icon: <SafeIcon Comp={Seedling} />,
    },
    {
      step: 2,
      title: "Quality Inspection & Sorting",
      desc:
        "Every batch is inspected for ripeness, size and quality. Only the best pieces are selected for packing — we reject anything that doesn't meet our standard.",
      img: "/images/2.png",
      icon: <SafeIcon Comp={CheckCircle} />,
    },
    {
      step: 3,
      title: "Hand-Packed into Boxes",
      desc:
        "Our pack specialists hand-assemble every box according to your chosen plan, adding protective, compostable padding to keep items fresh in transit.",
      img: "/images/3.png",
      icon: <SafeIcon Comp={PackageIcon} />,
    },
    {
      step: 4,
      title: "Fast Local Delivery",
      desc:
        "Boxes are sent via our temperature-aware logistics partners. Delivery windows are chosen to ensure freshness on arrival.",
      img: "/images/fast-local-delivary.png",
      icon: <SafeIcon Comp={Truck} />,
    },
    {
      step: 5,
      title: "Feedback & Continuous Improvement",
      desc:
        "We track feedback and nutrition data to refine box selections and seasonal offerings — your input directly shapes future boxes.",
      img: "/images/5.png",
      icon: <SafeIcon Comp={Users} />,
    },
  ]

  const faqs = [
    {
      q: "Are your items organic?",
      a: "We offer a mix — many farmers use organic or low-pesticide methods. Each product page notes if the item is organic.",
    },
    {
      q: "Can I change my plan later?",
      a: "Yes — you can upgrade/downgrade your subscription in your account settings. Changes take effect next billing cycle.",
    },
    {
      q: "How do you keep fruits fresh in transit?",
      a: "We pack by season, use protective compostable padding, and ship with partners who use temperature-aware handling when needed.",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container py-12 lg:py-20">
        {/* Hero */}
        <section className="grid gap-8 lg:grid-cols-2 items-center mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              How HealthFit delivers fresh goodness — from farm to your door
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              We believe transparency and care at every step creates the tastiest, healthiest boxes. Below
              is our end-to-end process so you know exactly what goes into your subscription.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="btn-primary">
                <Link href="#process">See our process</Link>
              </Button>

              <Button variant="outline" className="h-11">
                <Link href="#faqs">Read FAQs</Link>
              </Button>
            </div>

            {/* Quick stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickStats.map((s, idx) => (
                <div key={idx} className="hf-card flex items-center gap-3 p-3">
                  <div className="p-2 rounded-md bg-muted/60">{s.icon}</div>
                  <div>
                    <div className="text-lg font-semibold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/process-harvest.png"
              alt="Harvesting fresh fruit"
              width={1200}
              height={800}
              className="object-cover w-full h-80 lg:h-[480px]"
            />
          </div>
        </section>

        

        {/* Process timeline */}
        <section id="process" className="py-12">
          <h2 className="text-2xl font-semibold mb-3">Our process — step by step</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Every box goes through a sequence of careful checks and human attention. Here’s how we guarantee freshness and quality.
          </p>

          <div className="space-y-8">
            {timeline.map((t) => (
              <article key={t.step} className="grid gap-6 lg:grid-cols-12 items-center">
                <div className="lg:col-span-5">
                  <div className="rounded-lg overflow-hidden shadow-sm">
                    <Image src={t.img} alt={t.title} width={1200} height={800} className="object-cover w-full h-64" />
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20">
                      {t.icon}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Step {t.step}</div>
                      <h3 className="text-xl font-semibold">{t.title}</h3>
                    </div>
                  </div>

                  <p className="mt-4 text-muted-foreground max-w-3xl">{t.desc}</p>

                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    <li className="flex items-start gap-3">
                      <SafeIcon Comp={CheckCircle} />
                      <div>
                        <div className="font-medium">Quality checks</div>
                        <div className="text-sm text-muted-foreground">Visual & tactile inspection for ripeness.</div>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <SafeIcon Comp={Clock} />
                      <div>
                        <div className="font-medium">Fast processing</div>
                        <div className="text-sm text-muted-foreground">Boxes are processed same-day when possible.</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Packaging details */}
        <section className="py-12">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-3">Sustainable packaging</h2>
              <p className="text-muted-foreground mb-4">
                We use recyclable and compostable padding and minimal plastic. Our boxes are designed to protect produce while minimizing waste.
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-primary"><SafeIcon Comp={PackageIcon} /></div>
                  <div>
                    <div className="font-medium">Compostable padding</div>
                    <div className="text-sm text-muted-foreground">Keeps items secure without plastic waste.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="mt-1 text-primary"><SafeIcon Comp={Truck} /></div>
                  <div>
                    <div className="font-medium">Optimized routing</div>
                    <div className="text-sm text-muted-foreground">Shorter transit times for fresher deliveries.</div>
                  </div>
                </li>
              </ul>

              <div className="mt-6">
                <Button asChild className="btn-primary">
                  <Link href="#subscribe">Subscribe now</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-sm">
              <Image src="/images/process-packaging.png" alt="Packing boxes" width={1200} height={900} className="object-cover w-full h-72" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faqs" className="py-12">
          <h2 className="text-2xl font-semibold mb-4">Frequently asked questions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((f, i) => (
              <Card key={i} className="p-4">
                <h4 className="font-semibold">{f.q}</h4>
                <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials / Social proof */}
        <section className="py-12">
          <h2 className="text-2xl font-semibold mb-4">Customer stories</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">NA</div>
                <div>
                  <div className="font-semibold">Nagnath Avhad</div>
                  <div className="text-xs text-muted-foreground">Verified subscriber</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">"The boxes always arrive fresh and the variety is excellent. Love the sustainable packaging."</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">PP</div>
                <div>
                  <div className="font-semibold">Poonam Pandey</div>
                  <div className="text-xs text-muted-foreground">Verified subscriber</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">"Great taste and very convenient — I customized my plan easily."</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">AN</div>
                <div>
                  <div className="font-semibold">Anshu Nagnurwar</div>
                  <div className="text-xs text-muted-foreground">Verified subscriber</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">"Customer service is responsive and the produce quality is top-notch."</p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
