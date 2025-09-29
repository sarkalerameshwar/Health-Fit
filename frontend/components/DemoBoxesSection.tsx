"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Modal from "@/components/Modal"

/**
 * Demo boxes component — small, rounded cards with circular images.
 * - Clicking "Complete Order" opens a modal with contact info (no redirect).
 * - Place images under /public/ (e.g. /public/demo-mini.jpg, /public/demo-large.jpg)
 */

const demoBoxes = [
  {
    id: "demo-mini",
    name: "Quick Demo Mini",
    price: "₹59",
    originalPrice: "₹79",
    period: "one-time",
    description: "Try a small sample box before subscribing",
    image: "/mini-box.jpg", // put file in public/
    popular: false,
  },
  {
    id: "demo-large",
    name: "Quick Demo Large",
    price: "₹89",
    originalPrice: "₹119",
    period: "one-time",
    description: "Try a larger sample box",
    image: "/large-box.jpg",
    popular: true,
  },
]

export default function DemoBoxesSection() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<typeof demoBoxes[number] | null>(null)

  const onComplete = (box: typeof demoBoxes[number]) => {
    setSelected(box)
    setOpen(true)
  }

  /**
   * When the modal opens, the Modal component will have created
   * elements inside the portal (id="modal-root"). We need to wait
   * a tick for that DOM to exist, then scroll the modal into view
   * and focus a button inside it so it appears centered for the user.
   */
  useEffect(() => {
    if (!open) return

    // small delay so portal/children finish rendering
    const t = setTimeout(() => {
      try {
        // the modal-root contains the dialog element we created in Modal.tsx
        const root = document.getElementById("modal-root")
        if (!root) return

        // find the dialog wrapper we render (role="dialog")
        const dialog = root.querySelector('[role="dialog"]')
        if (!dialog) return

        // find inner container (the one we gave mx-auto max-h... in Modal) - fallback to dialog itself
        const content = dialog.querySelector(".mx-auto") || dialog

        // scroll it to center of viewport
        ;(content as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" })

        // try to focus an interactive control inside modal (close button, copy button etc.)
        // prefer a button with text "Copy Phone" or the first button found
        const focusable =
          dialog.querySelector('button[aria-label="Close"]') ||
          dialog.querySelector('button') ||
          dialog.querySelector('a')
        if (focusable && (focusable as HTMLElement).focus) {
          ;(focusable as HTMLElement).focus()
        }
      } catch (err) {
        // ignore DOM errors in environments where document isn't available
        // (this is safe, effect runs only in browser)
      }
    }, 50)

    return () => clearTimeout(t)
  }, [open])

  return (
    <>
      <section className="py-10 sm:py-14" id="DemoBoxesSection">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold">Quick Demo Boxes</h3>
            <p className="text-muted-foreground max-w-[720px] mx-auto mt-2">
              One-time demo boxes to sample our produce. Contact us to place a demo order.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center items-stretch">
            {demoBoxes.map((box) => (
              <Card
                key={box.id}
                className="mx-auto max-w-xs w-full rounded-2xl bg-white/90 border border-gray-100 shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1"
              >
                <CardContent className="flex flex-col items-center p-5">
                  <div className="relative w-28 h-28 mb-3">
                    <Image
                      src={box.image}
                      alt={box.name}
                      fill
                      className="object-cover rounded-full border-4 border-primary/10"
                    />
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CardTitle className="text-lg">{box.name}</CardTitle>
                      {box.popular && <Badge className="bg-primary/10 text-primary">Popular</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{box.description}</p>
                  </div>

                  <div className="mt-4 flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground line-through">{box.originalPrice}</span>
                    <div className="text-2xl font-bold text-primary">{box.price}</div>
                    <span className="text-xs text-muted-foreground">{box.period}</span>
                  </div>

                  <div className="w-full mt-5">
                    <Button className="w-full rounded-full" onClick={() => onComplete(box)} variant="default">
                      Complete Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modal (portal) */}
      <Modal open={open && !!selected} onClose={() => setOpen(false)} ariaLabel="Demo order details">
        <div className="bg-card rounded-xl shadow-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold">Demo Order Request</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {selected?.name} — {selected?.price}
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="p-1 rounded-md hover:bg-muted/60">
              ✕
            </button>
          </div>

          <div className="mt-4 text-sm text-muted-foreground space-y-3">
            <p>
              For demo orders we process them manually. Please contact us to place a demo order — we’ll prepare and arrange delivery.
            </p>

            <div className="rounded-md p-3 bg-muted/60">
              <p className="text-sm">
                Call / WhatsApp:{" "}
                <a className="text-primary font-medium" href="tel:+919226442954">
                  +91 92264 42954
                </a>
              </p>
              <p className="text-sm">
                Email:{" "}
                <a className="text-primary font-medium" href="mailto:healthfit189@gmail.com">
                  healthfit189@gmail.com
                </a>
              </p>
            </div>

            <p className="text-xs text-muted-foreground">Mention the demo box name when contacting us so we can prepare it quickly.</p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard?.writeText("+919226442954").catch(() => {})
                setOpen(false)
                // eslint-disable-next-line no-alert
                alert("Phone number copied to clipboard. Please contact us via WhatsApp or call.")
              }}
            >
              Copy Phone
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
