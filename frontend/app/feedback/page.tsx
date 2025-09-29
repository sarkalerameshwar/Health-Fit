"use client";

import type React from "react";
import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CheckCircle, Star } from "lucide-react";

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rating, setRating] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    feedback: "",
  });

  const url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const useremail = localStorage.getItem("useremail");

    if (!token || !userStr) {
      alert("Please log in first.");
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user.userId || user._id;
    const username = user.username || user.name;
    const email = user.email || useremail; // Support both keys

    if (!rating || !formData.category || !formData.feedback) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        userId,
        username,
        email,
        category: formData.category,
        message: formData.feedback,
        rating: parseInt(rating),
      };

      console.log("Payload to send:", payload);

      const res = await fetch(`${url}/api/feedback/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      setIsSuccess(true);
      setRating("");
      setFormData({ category: "", feedback: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(
        (error as Error).message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary">Thank You!</h1>
            <p className="text-xl text-muted-foreground">
              Your feedback has been submitted successfully. We appreciate your
              input!
            </p>
            <Button onClick={() => setIsSuccess(false)}>
              Submit More Feedback
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-balance">
            Share Your Feedback
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Your opinion matters to us. Help us improve our service by sharing
            your experience.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Form</CardTitle>
              <CardDescription>
                Tell us about your HealthFit experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div className="space-y-3">
                  <Label>Overall Rating</Label>
                  <RadioGroup value={rating} onValueChange={setRating}>
                    {[
                      { value: "5", label: "Excellent" },
                      { value: "4", label: "Good" },
                      { value: "3", label: "Average" },
                      { value: "2", label: "Poor" },
                      { value: "1", label: "Very Poor" },
                    ].map((item) => (
                      <div
                        key={item.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={item.value}
                          id={`r${item.value}`}
                        />
                        <Label
                          htmlFor={`r${item.value}`}
                          className="flex items-center gap-1"
                        >
                          <div className="flex">
                            {[...Array(parseInt(item.value))].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-primary text-primary"
                              />
                            ))}
                            {[...Array(5 - parseInt(item.value))].map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 text-muted-foreground"
                                />
                              )
                            )}
                          </div>
                          {item.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <Label>Feedback Category</Label>
                  <RadioGroup
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    {[
                      "Product Quality",
                      "Delivery Service",
                      "Customer Service",
                      "Website Experience",
                      "Pricing",
                      "Other",
                    ].map((cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={cat}
                          id={cat.replace(/\s/g, "")}
                        />
                        <Label htmlFor={cat.replace(/\s/g, "")}>{cat}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Feedback Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="feedback">Your Feedback</Label>
                  <Textarea
                    id="feedback"
                    rows={6}
                    placeholder="Please share your detailed feedback, suggestions, or any issues you experienced..."
                    value={formData.feedback}
                    onChange={(e) =>
                      handleInputChange("feedback", e.target.value)
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
