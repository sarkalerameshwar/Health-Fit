// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Header } from "@/components/header"
// import { Footer } from "@/components/footer"
// import { Button } from "@/components/ui/button"
// import { PlanSelector } from "@/components/subscription/plan-selector"
// import { ProductCustomizer } from "@/components/subscription/product-customizer"
// import { NutritionChart } from "@/components/subscription/nutrition-chart"
// import { ArrowRight, ArrowLeft } from "lucide-react"
// import type { SubscriptionPlan } from "@/lib/subscriptions"

// export default function SubscriptionPage() {
//   const router = useRouter()
//   const [currentStep, setCurrentStep] = useState(1)
//   const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([])

//   const steps = [
//     { number: 1, title: "Choose Plan", description: "Select your subscription plan" },
//     { number: 2, title: "Customize Box", description: "Pick your favorite fruits" },
//   ]

//   const handleNext = () => {
//     if (currentStep < 2) {
//       setCurrentStep(currentStep + 1)
//     } else if (currentStep === 2) {
//       // Store subscription data in localStorage for checkout page
//       const subscriptionData = {
//         plan: selectedPlan,
//         products: selectedProducts,
//         timestamp: Date.now(),
//       }
//       localStorage.setItem("healthfit-subscription", JSON.stringify(subscriptionData))
//       router.push("/checkout")
//     } else {
//       // Proceed to checkout (fallback for step 3 if still needed)
//       router.push("/checkout")
//     }
//   }

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1)
//     }
//   }

//   const canProceed = () => {
//     switch (currentStep) {
//       case 1:
//         return selectedPlan !== null
//       case 2:
//         return selectedProducts.length > 0 && selectedPlan !== null
//       default:
//         return false
//     }
//   }

//   return (
//     <div className="min-h-screen">
//       <Header />
//       <main className="container py-4 sm:py-8">
//         {/* Progress Steps */}
//         <div className="mb-6 sm:mb-8">
//           <div className="flex items-center justify-center space-x-4 sm:space-x-8">
//             {steps.map((step, index) => (
//               <div key={step.number} className="flex items-center">
//                 <div className="flex flex-col items-center">
//                   <div
//                     className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
//                       currentStep >= step.number
//                         ? "bg-primary text-primary-foreground"
//                         : "bg-muted text-muted-foreground"
//                     }`}
//                   >
//                     {step.number}
//                   </div>
//                   <div className="mt-2 text-center">
//                     <p className="text-xs sm:text-sm font-medium">{step.title}</p>
//                     <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
//                   </div>
//                 </div>
//                 {index < steps.length - 1 && (
//                   <div className="w-8 sm:w-16 h-px bg-border mx-2 sm:mx-4 mt-[-1.5rem] sm:mt-[-2rem]" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Step Content */}
//         <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
//           <div className="lg:col-span-2">
//             {currentStep === 1 && <PlanSelector selectedPlan={selectedPlan} onPlanSelect={setSelectedPlan} />}

//             {currentStep === 2 && selectedPlan && (
//               <ProductCustomizer
//                 selectedPlan={selectedPlan}
//                 selectedProducts={selectedProducts}
//                 onProductsChange={setSelectedProducts}
//               />
//             )}
//           </div>

//           {/* Nutrition Chart Sidebar */}
//           <div className="lg:col-span-1 order-first lg:order-last">
//             <div className="lg:sticky lg:top-24">
//               <NutritionChart selectedProducts={selectedProducts} />
//             </div>
//           </div>
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 mt-6 sm:mt-8 px-4 sm:px-0">
//           <Button
//             variant="outline"
//             onClick={handleBack}
//             disabled={currentStep === 1}
//             className="w-full sm:w-auto order-2 sm:order-1 bg-transparent"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back
//           </Button>

//           <Button onClick={handleNext} disabled={!canProceed()} className="w-full sm:w-auto order-1 sm:order-2">
//             {currentStep === 2 ? "Proceed to Checkout" : "Next"}
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Button>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }
