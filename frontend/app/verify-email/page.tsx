"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    // Get user email from localStorage
    const pendingUser = localStorage.getItem("pendingUser")
    if (pendingUser) {
      const userData = JSON.parse(pendingUser)
      setUserEmail(userData.email)
    } else {
      // Redirect to signup if no pending user
      router.push("/signup")
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verify OTP
      const storedOTP = localStorage.getItem("otp")
      const otpExpiry = localStorage.getItem("otpExpiry")

      if (!storedOTP || !otpExpiry) {
        setError("OTP has expired. Please request a new one.")
        return
      }

      if (Date.now() > Number.parseInt(otpExpiry)) {
        setError("OTP has expired. Please request a new one.")
        return
      }

      if (otp === storedOTP) {
        const pendingUser = localStorage.getItem("pendingUser")
        if (pendingUser) {
          const userData = JSON.parse(pendingUser)

          // Store verified user (in real app, this would be sent to backend)
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...userData,
              verified: true,
              id: Date.now().toString(),
            }),
          )

          // Clean up temporary data
          localStorage.removeItem("pendingUser")
          localStorage.removeItem("otp")
          localStorage.removeItem("otpExpiry")

          setSuccess(true)

          // Redirect to login after success
          setTimeout(() => {
            router.push("/login")
          }, 2000)
        }
      } else {
        setError("Invalid OTP. Please check and try again.")
      }
    } catch (err) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate new OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
      localStorage.setItem("otp", newOtp)
      localStorage.setItem("otpExpiry", (Date.now() + 5 * 60 * 1000).toString())

      console.log(`[v0] New OTP sent to ${userEmail}: ${newOtp}`) // For demo purposes

      // Reset timer
      setTimeLeft(300)
      setOtp("")
    } catch (err) {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-primary mx-auto" />
                <h2 className="text-2xl font-semibold">Email Verified!</h2>
                <p className="text-muted-foreground">Your account has been successfully created and verified.</p>
                <p className="text-sm text-muted-foreground">Redirecting to login page...</p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to
              <br />
              <strong>{userEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)} disabled={isLoading}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button onClick={handleVerifyOTP} className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Email
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Code expires in: <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                </p>

                {timeLeft > 0 ? (
                  <Button variant="ghost" onClick={handleResendOTP} disabled={isResending} className="text-sm">
                    {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Didn't receive the code? Resend
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-sm bg-transparent"
                  >
                    {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Resend OTP
                  </Button>
                )}
              </div>

              <Button variant="ghost" asChild className="w-full">
                <Link href="/signup" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign Up
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
