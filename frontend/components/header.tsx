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
import { User, Menu, X } from "lucide-react";

export function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  // Prevent body scroll when dropdown or mobile menu is open
  useEffect(() => {
    if (isDropdownOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/login");
  };

  const handleDashboardClick = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/dashboard");
  };

  const handleNavigationClick = (path: string) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/offers", label: "Offers" },
    { href: "/products", label: "Products" },
    { href: "/inquiry", label: "Inquiry" },
    { href: "/feedback", label: "Feedback" },
  ];

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
          {navigationItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

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
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent
                align="end"
                side="bottom" // Changed to bottom for better mobile behavior
                sideOffset={8}
                collisionPadding={16}
                avoidCollisions={true}
                className="w-56 rounded-lg shadow-xl border bg-background z-[100]"
                onCloseAutoFocus={(event) => event.preventDefault()}
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

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg z-40">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigationClick(item.href)}
                  className="text-left py-3 px-4 hover:bg-accent rounded-lg transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Auth buttons for mobile when not logged in */}
              {!isLoggedIn && (
                <>
                  <Button asChild variant="ghost" className="justify-start py-3 px-4 h-auto">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild className="justify-start py-3 px-4 h-auto">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}