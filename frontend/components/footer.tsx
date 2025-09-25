"use client"

import Link from "next/link"
import { Leaf, Facebook, Twitter, Instagram, Mail, Phone, User } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Logo + Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6" />
              <span className="text-xl font-bold">HealthFit</span>
            </div>
            <p className="text-white/80 text-pretty">
              Delivering fresh, organic fruits to support your healthy lifestyle journey.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
              <Mail className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white hover:text-secondary hover:underline transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-white hover:text-secondary hover:underline transition-colors">
                  Offers
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="text-white hover:text-secondary hover:underline transition-colors">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-white hover:text-secondary hover:underline transition-colors">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/inquiry" className="text-white hover:text-secondary hover:underline transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-white hover:text-secondary hover:underline transition-colors">
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white hover:text-secondary hover:underline transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-white hover:text-secondary hover:underline transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-white hover:text-secondary hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white hover:text-secondary hover:underline transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-white hover:text-secondary hover:underline transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-white hover:text-secondary hover:underline transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Technical Support</h3>
            <ul className="space-y-3 text-white">
              <li className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Anuj Nandgaonkar, Rameshwar Sarkale</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+917499963100" className="text-white hover:text-secondary hover:underline transition-colors">
                  7499963100, 8080652957
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="rameshwarsarkale21@gmail.com" className="text-white hover:text-secondary hover:underline transition-colors">
                  rameshwarsarkale21@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-white/80">
            © 2024 HealthFit. All rights reserved. Made with ❤️ for healthy living.
          </p>
        </div>
      </div>
    </footer>
  )
}
