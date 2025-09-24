import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}
