"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""); // From localStorage
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Load email from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("useremail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Get email from localStorage
    const storedEmail = localStorage.getItem("useremail");
    if (!storedEmail) {
      setError("User email not found. Please log in again.");
      return;
    }

    // Validation
    if (!otp || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("https://healthfit-backend.onrender.com/api/user/verify-reset-password-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: storedEmail, otp, newPassword: password }),
      });

      const data = await res.json();

      const userId = data.id; // Get user ID from response

      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setIsSuccess(true); // Show success message
    } catch (err: any) {
      console.error("Error resetting password:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle>Password Reset Successful</CardTitle>
              <CardDescription>
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mt-4" />
                Your password has been updated successfully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push("/login")}>
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter the OTP sent to your email and set a new password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
