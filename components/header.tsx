"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, Phone, Mail } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useSiteSettings } from "@/hooks/use-site-settings"
import { QuickCartMenu } from "@/components/quick-cart-menu"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const { settings } = useSiteSettings()
  const isCartDialogOpen = false
  const setIsCartDialogOpen = () => {}

  const headerLogo = settings?.headerLogoUrl || "/placeholder-logo.svg"

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Bulk Order", href: "/bulk-order" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>+91 9885317726</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>godavaridelights1@gmail.com</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span>Free shipping on orders above ₹500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              {headerLogo && headerLogo.startsWith('/') && !headerLogo.includes('placeholder') ? (
                <Image
                  src={headerLogo}
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-primary-foreground font-bold text-sm">AP</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">Athrayapuram</span>
              <span className="text-xs text-muted-foreground">Putharekulu</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <QuickCartMenu />

            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Hi, {user.name?.split(' ')[0] || 'User'}</span>
                  </Button>
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout} className="hidden md:flex">
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
