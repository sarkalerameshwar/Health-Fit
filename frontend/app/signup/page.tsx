import { SignupForm } from "@/components/auth/signup-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <SignupForm />
      </main>
      <Footer />
    </div>
  )
}
