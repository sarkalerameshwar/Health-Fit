"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Mail } from "lucide-react"
import Link from "next/link"

/**
 * Referral page:
 * - Invite up to 5 emails
 * - On success user receives a 10% discount code stored in localStorage
 */

const MAX_INVITES = 5

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function generateReferralCode() {
  // friendly readable code, 10% discount
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `HF-REF10-${rand}`
}

export default function ReferralPage() {
  const [emails, setEmails] = useState<string[]>(
    Array.from({ length: MAX_INVITES }).map(() => "")
  )
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [successCode, setSuccessCode] = useState<string | null>(null)
  const [sentCount, setSentCount] = useState<number | null>(null)

  const handleEmailChange = (idx: number, value: string) => {
    const next = [...emails]
    next[idx] = value
    setEmails(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // collect non-empty trimmed emails
    const filled = emails.map((s) => s.trim()).filter((s) => s.length > 0)

    if (filled.length === 0) {
      setError("Please add at least one email to invite (up to 5).")
      return
    }
    if (filled.length > MAX_INVITES) {
      setError(`You can invite up to ${MAX_INVITES} people.`)
      return
    }

    // validate emails
    const invalid = filled.filter((em) => !isValidEmail(em))
    if (invalid.length > 0) {
      setError(`Please correct the invalid email(s): ${invalid.join(", ")}`)
      return
    }

    // simulate sending invites
    setIsSending(true)
    try {
      await new Promise((r) => setTimeout(r, 900)) // fake network

      // pretend we "sent" the invites; log to console for demo
      filled.forEach((to) =>
        console.info(`[referral] Invite sent to ${to} by current user at ${new Date().toISOString()}`)
      )

      // generate discount code and persist it
      const code = generateReferralCode()
      const discount = {
        code,
        percent: 10,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        invited: filled,
      }
      localStorage.setItem("referralDiscount", JSON.stringify(discount))

      setSuccessCode(code)
      setSentCount(filled.length)

      // optional: clear inputs
      setEmails(Array.from({ length: MAX_INVITES }).map(() => ""))
    } catch (err) {
      console.error("Referral send error", err)
      setError("Failed to send invites. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Invite friends — get 10% off</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Invite up to {MAX_INVITES} friends — when they sign up, you’ll receive a 10% discount code for your next subscription month.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {!successCode ? (
            <Card className="hf-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Send Invitations</CardTitle>
                    <CardDescription>
                      Enter the email addresses of up to {MAX_INVITES} people you want to invite.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-3">
                    {emails.map((val, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="email"
                          placeholder={`Friend #${idx + 1} email`}
                          value={val}
                          onChange={(e) => handleEmailChange(idx, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-md"
                          disabled={isSending}
                        />
                        <span className="text-sm text-muted-foreground">{idx + 1}</span>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div className="text-sm text-destructive mt-1">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button type="submit" className="hf-cta" disabled={isSending}>
                      {isSending ? "Sending…" : "Send Invites"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEmails(Array.from({ length: MAX_INVITES }).map(() => ""))
                        setError(null)
                      }}
                      disabled={isSending}
                    >
                      Clear
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="hf-card">
              <CardContent className="text-center">
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-semibold">Invites Sent</h3>
                  <p className="text-muted-foreground">
                    You invited <strong>{sentCount}</strong> {sentCount === 1 ? "person" : "people"}.
                  </p>

                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm">Your 10% discount code:</p>
                    <div className="mt-2 flex items-center justify-center gap-3">
                      <Badge className="hf-badge">{successCode}</Badge>
                      <div className="text-sm text-muted-foreground">10% off — valid for 30 days</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      The invitees will receive an email with signup instructions. Once they sign up, your code is ready to use on the subscription page.
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3 w-full max-w-xs">
                    <Button onClick={() => { navigator.clipboard?.writeText(successCode) }} className="w-full">
                      Copy Code
                    </Button>
                    <Link href="/subscription" className="w-full">
                      <Button variant="outline" className="w-full">Use Code</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Note: This demo simulates sending invites (check the browser console for invite logs).
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
