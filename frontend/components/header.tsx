"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  // Prevent body scroll when dropdown is open
  useEffect(() => {
    if (isDropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    router.push("/login");
  };

  const handleDashboardClick = () => {
    setIsDropdownOpen(false);
    router.push("/dashboard");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logo1.png"
            alt="HealthFit Logo"
            width={80}
            height={80}
            className="h-16 w-32 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/offers" className="hover:text-primary transition-colors">Offers</Link>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <Link href="/inquiry" className="hover:text-primary transition-colors">Inquiry</Link>
          <Link href="/feedback" className="hover:text-primary transition-colors">Feedback</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted transition-colors relative"
                  aria-label="User menu"
                >
                  <User className="h-5 w-5" />
                  {/* Online status indicator */}
                  {/* <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span> */}
                </Button>
              </DropdownMenuTrigger>
              
              {/* DROPDOWN THAT ALWAYS OPENS ABOVE */}
              <DropdownMenuContent
                align="end"
                side="top" // Force opening above the trigger
                sideOffset={8} // Distance from trigger
                collisionPadding={16} // Padding from viewport edges
                avoidCollisions={true}
                className="w-56 rounded-lg shadow-xl border bg-background z-[100]"
                position="popper"
                onCloseAutoFocus={(event) => event.preventDefault()}
                onEscapeKeyDown={() => setIsDropdownOpen(false)}
              >
                {/* User Info Section */}
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold text-sm text-foreground">Welcome back!</p>
                  <p className="text-xs text-muted-foreground mt-1">Manage your account</p>
                </div>

                <DropdownMenuSeparator />

                {/* Dashboard Link */}
                <DropdownMenuItem 
                  onClick={handleDashboardClick}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-accent rounded-md mx-1 mt-1"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Dashboard</p>
                    <p className="text-xs text-muted-foreground">View your account</p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout Button */}
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 rounded-md mx-1 mb-1 group"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 group-hover:bg-red-200 transition-colors">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
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
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link href="/login" className="hover:text-primary">Sign In</Link>
              </Button>
              <Button asChild className="hidden md:inline-flex">
                <Link href="/signup" className="text-white">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}