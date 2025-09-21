import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MealBoxesSection } from "@/components/meal-boxes-section"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { CustomerFeedbackSection } from "@/components/customer-feedback-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <MealBoxesSection />
        <WhyChooseUsSection />
        <CustomerFeedbackSection />
      </main>
      <Footer />
    </div>
  )
}
