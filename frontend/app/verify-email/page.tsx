"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get user data from localStorage (stored after signup)
    const userData = localStorage.getItem("user");
    const useremail = localStorage.getItem("useremail");
    
    if (userData) {
      const user = JSON.parse(userData);
      setUserEmail(user.userEmail || useremail || "");
    } else {
      router.push("/signup");
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Get current user data from localStorage
      const userData = localStorage.getItem("user");
      const useremail = localStorage.getItem("useremail");
      
      if (!userData || !useremail) {
        setError("No user data found. Please signup again.");
        setIsLoading(false);
        return;
      }

      const existingUser = JSON.parse(userData);
      const email = existingUser.userEmail || useremail;

      // Send OTP verification request to backend
      const response = await fetch(
        "http://localhost:5000/api/user/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otp.trim() }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "OTP verification failed.");
        setIsLoading(false);
        return;
      }

      console.log("OTP verification response:", data);

      // ✅ Get the userId from backend response (data.id)
      const userId = data.id;
      
      if (!userId) {
        setError("User verification failed. No user ID received.");
        setIsLoading(false);
        return;
      }

      // ✅ Update user data with actual userId from backend and set isVerified = true
      const updatedUser = {
        username: existingUser.username,
        userId: userId, // Actual userId from backend response
        userEmail: existingUser.userEmail || email,
        isVerified: true,
      };

      // ✅ Store updated user info in localStorage (same format as LoginForm)
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("useremail", updatedUser.userEmail);
      localStorage.setItem("isVerified", "true");

      // ✅ Store JWT from backend
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setSuccess(true);

      // ✅ Redirect to dashboard
      setTimeout(() => router.replace("/dashboard"), 2000);
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");

    try {
      // Get user email from localStorage
      const userData = localStorage.getItem("user");
      const useremail = localStorage.getItem("useremail");
      
      if (!userData || !useremail) {
        setError("No user data found.");
        return;
      }

      const user = JSON.parse(userData);
      const email = user.userEmail || useremail;

      const response = await fetch(
        "http://localhost:5000/api/user/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to resend OTP");
        return;
      }

      setTimeLeft(300);
      setOtp("");
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-2xl font-semibold">Email Verified!</h2>
            <p className="text-muted-foreground">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to <br />
            <strong>{userEmail}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

         <div className="flex justify-center">
  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
    <InputOTPGroup>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <InputOTPSlot 
          key={index}
          index={index} 
          className="border-2 border-gray-300 rounded-md text-lg font-medium transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      ))}
    </InputOTPGroup>
  </InputOTP>
</div>
          <Button
            onClick={handleVerifyOTP}
            className="w-full"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Code expires in:{" "}
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </p>

          <Button
            variant="ghost"
            onClick={handleResendOTP}
            disabled={isResending || timeLeft === 0}
            className="w-full text-sm"
          >
            {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Resend OTP
          </Button>

          <Button variant="ghost" asChild className="w-full">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign Up
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}