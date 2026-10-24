"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BrandMark } from "@/components/brand-mark"
import { ResponsiveImage } from "@/components/responsive-image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, Phone, Mail } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useSiteSettings } from "@/hooks/use-site-settings"
import { QuickCartMenu } from "@/components/quick-cart-menu"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user, logout } = useAuth()
  const { settings } = useSiteSettings()
  const isCartDialogOpen = false
  const setIsCartDialogOpen = () => {}

  const headerLogo = settings?.headerLogoUrl
  const customHeaderLogo = headerLogo && !headerLogo.includes("placeholder") ? headerLogo : null

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Bulk Order", href: "/bulk-order" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const prefetchNavigation = (href: string) => {
    router.prefetch(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-y-1 text-xs sm:text-sm">
            <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>+91 9885469456</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>godavaridelights1@gmail.com</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span>Free shipping on orders of ₹1,500 or more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" aria-label="Godavari Delights home" className="flex shrink-0 items-center gap-2">
            {customHeaderLogo ? (
              <span className="relative block h-10 w-10 shrink-0 overflow-hidden">
                <ResponsiveImage
                  src={customHeaderLogo}
                  alt="Godavari Delights logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </span>
            ) : (
              <BrandMark size={40} />
            )}
            <span className="whitespace-nowrap font-bold text-base leading-tight sm:text-lg">Godavari Delights</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onMouseEnter={() => prefetchNavigation(item.href)}
                onFocus={() => prefetchNavigation(item.href)}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-4">
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
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            )}

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" aria-label="Open navigation menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[min(22rem,calc(100vw-1rem))] max-w-[90vw] gap-0 overflow-y-auto p-0 pt-[env(safe-area-inset-top)]"
              >
                <SheetHeader className="border-b px-6 pb-5 pt-8 pr-16 text-left">
                  <SheetTitle className="text-xl">Explore Godavari Delights</SheetTitle>
                  <SheetDescription>Traditional sweets, made with care.</SheetDescription>
                </SheetHeader>
                <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-4 py-5">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onTouchStart={() => prefetchNavigation(item.href)}
                      onFocus={() => prefetchNavigation(item.href)}
                      className="flex min-h-12 w-full items-center rounded-lg px-4 text-base font-medium transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
