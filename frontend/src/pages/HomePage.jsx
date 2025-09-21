import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { MealBoxesSection } from "@/components/MealBoxesSection"
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection"
import { CustomerFeedbackSection } from "@/components/CustomerFeedbackSection"
import { Footer } from "@/components/Footer"

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
