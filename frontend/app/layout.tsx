import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import SplashWrapper from "@/components/SplashWrapper"   // ✅ import wrapper

export const metadata: Metadata = {
  title: "HealthFit - Fresh Fruit Meal Boxes",
  description: "Customize your healthy lifestyle with fresh fruit meal boxes delivered to your door",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" nighteye="disabled">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Splash runs on client only */}
        <SplashWrapper />

        {/* Main app content */}
        <Suspense fallback={null}>{children}</Suspense>

        <Analytics />
      </body>
    </html>
  )
}
