"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const storedOtp = localStorage.getItem("otp")
      const otpExpiry = localStorage.getItem("otpExpiry")
      const pendingUser = localStorage.getItem("pendingUser")

      if (!storedOtp || !otpExpiry || !pendingUser) {
        setError("Verification session expired. Please sign up again.")
        return
      }

      if (Date.now() > Number.parseInt(otpExpiry)) {
        setError("Verification code has expired. Please request a new one.")
        return
      }

      if (otp === storedOtp) {
        const userData = JSON.parse(pendingUser)
        const verifiedUser = { ...userData, verified: true }

        localStorage.setItem("user", JSON.stringify(verifiedUser))
        localStorage.removeItem("pendingUser")
        localStorage.removeItem("otp")
        localStorage.removeItem("otpExpiry")

        setSuccess(true)
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (err) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
      localStorage.setItem("otp", newOtp)
      localStorage.setItem("otpExpiry", (Date.now() + 5 * 60 * 1000).toString())

      console.log(`[v0] New OTP sent: ${newOtp}`)

      setCountdown(300)
      setCanResend(false)
      setOtp("")
    } catch (err) {
      setError("Failed to resend code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
              <p className="text-muted-foreground mb-4">
                Your account has been successfully verified. Redirecting to login...
              </p>
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
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to your email address. Enter it below to complete your
              registration.
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
                <InputOTP value={otp} onChange={setOtp} maxLength={6}>
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

              <div className="text-center text-sm text-muted-foreground">
                {countdown > 0 ? (
                  <p>Code expires in {formatTime(countdown)}</p>
                ) : (
                  <p className="text-destructive">Code has expired</p>
                )}
              </div>

              <Button onClick={handleVerify} className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Email
              </Button>

              <div className="text-center">
                <Button variant="ghost" onClick={handleResend} disabled={!canResend || isLoading} className="text-sm">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : canResend ? (
                    "Resend Code"
                  ) : (
                    `Resend in ${formatTime(countdown)}`
                  )}
                </Button>
              </div>

              <div className="text-center text-sm">
                <Link to="/signup" className="text-primary hover:underline">
                  Back to Sign Up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
