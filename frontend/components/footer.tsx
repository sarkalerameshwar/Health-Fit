import Link from "next/link"
import { Leaf, Facebook, Twitter, Instagram, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6" />
              <span className="text-xl font-bold">HealthFit</span>
            </div>
            <p className="text-primary-foreground/80 text-pretty">
              Delivering fresh, organic fruits to support your healthy lifestyle journey.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
              <Mail className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/subscription"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/inquiry" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-primary-foreground/80">
            © 2024 HealthFit. All rights reserved. Made with ❤️ for healthy living.
          </p>
        </div>
      </div>
    </footer>
  )
}
