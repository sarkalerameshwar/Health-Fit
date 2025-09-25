"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, CreditCard, User, Settings, BarChart3, Calendar } from "lucide-react"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Subscription",
    href: "/dashboard/subscription",
    icon: Package,
  },
  {
    title: "Order History",
    href: "/dashboard/orders",
    icon: CreditCard,
  },
  // {
  //   title: "Nutrition Tracking",
  //   href: "/dashboard/nutrition",
  //   icon: BarChart3,
  // },
  // {
  //   title: "Delivery Schedule",
  //   href: "/dashboard/schedule",
  //   icon: Calendar,
  // },
  // {
  //   title: "Profile",
  //   href: "/dashboard/profile",
  //   icon: User,
  // },
  // {
  //   title: "Settings",
  //   href: "/dashboard/settings",
  //   icon: Settings,
  // },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === item.href && "bg-muted text-primary",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
