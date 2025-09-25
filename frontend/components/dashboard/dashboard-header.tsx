"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import PrivateRoute from "@/components/PrivateRoute";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, LogOut, HelpCircle, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { mockUser } from "@/lib/dashboard"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Redirect to login page
    router.push("/login");
  };

  return (
    <PrivateRoute>
      <header className="flex h-16 items-center gap-4 border-b bg-gradient-to-r from-background to-muted/20 px-6">
        <div className="w-full flex-1">
          <form>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders, products, customers..."
                className="w-full pl-10 pr-4 h-10 bg-background/80 border-border/50 rounded-lg transition-all focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </form>
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-10 px-2 rounded-full bg-background hover:bg-muted transition-all duration-200 border border-border/30 shadow-sm hover:shadow-md"
            >
              <Avatar className="h-8 w-8 border-2 border-primary/20 shadow-sm">
                <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.firstName} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-semibold">
                  {mockUser.firstName[0]}
                  {mockUser.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          {/* SOLID BACKGROUND DROPDOWN */}
          <DropdownMenuContent 
            align="end" 
            className="w-80 rounded-xl shadow-xl border border-border/50 bg-background" // <- removed transparency
          >
            <DropdownMenuSeparator className="bg-border/30" />

            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-4 pt-3 pb-2">
              Quick Actions
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-border/30" />

            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-primary/5 rounded-lg mx-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm">Help Center</p>
                <p className="text-xs text-muted-foreground">Get help and support</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-primary/5 rounded-lg mx-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm">Privacy & Terms</p>
                <p className="text-xs text-muted-foreground">Legal information</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border/30" />

            {/* Logout Section */}
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600 rounded-lg mx-2 mb-2 group"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                <LogOut className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm">Sign Out</p>
                <p className="text-xs text-muted-foreground group-hover:text-red-500/80">
                  Logout from your account
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </PrivateRoute>
  )
}
