"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Menu,
  Home,
  LogOut,
  Gift,
  MessageCircle,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Mail,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NavigationChild {
  name: string
  href: string
}

interface NavigationItem {
  name: string
  href: string
  icon: any
  badge?: string | null
  children?: NavigationChild[]
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    badge: null,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    badge: null,
  },
  {
    name: "Bulk Orders",
    href: "/admin/bulk-orders",
    icon: Package,
    badge: null,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
    badge: null,
  },
  {
    name: "Marketing",
    href: "/admin/marketing",
    icon: Gift,
    children: [
      { name: "Promotions", href: "/admin/promotions" },
      { name: "Coupons", href: "/admin/coupons" },
    ],
  },
  {
    name: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
    children: [
      { name: "Campaigns", href: "/admin/newsletter/campaigns" },
      { name: "Templates", href: "/admin/newsletter/templates" },
      { name: "Subscribers", href: "/admin/newsletter/subscribers" },
      { name: "Analytics", href: "/admin/newsletter/analytics" },
      { name: "Settings", href: "/admin/newsletter/settings" },
    ],
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Support",
    href: "/admin/support",
    icon: MessageCircle,
    badge: null,
  },
]

const bottomNavigation = [
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Razorpay Config", href: "/admin/settings", icon: CreditCard },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    children: [
      { name: "SMS Configuration", href: "/admin/settings/sms" },
    ]
  },
]

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((item) => item !== itemName) : [...prev, itemName],
    )
  }

  const isItemActive = (href: string, children?: any[]) => {
    if (pathname === href) return true
    if (children) {
      return children.some((child) => pathname === child.href)
    }
    return false
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AP</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">Admin Panel</span>
            <span className="text-xs text-muted-foreground">Putharekulu Management</span>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">{user?.name?.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                Administrator
              </Badge>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = isItemActive(item.href, item.children)
          const isExpanded = expandedItems.includes(item.name)

          return (
            <div key={item.name}>
              {item.children ? (
                <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(item.name)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between px-3 py-2 h-auto text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs h-5 px-1.5">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 ml-6 rounded-lg text-sm transition-colors",
                          pathname === child.href
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs h-5 px-1.5 ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = isItemActive(item.href, item.children)
          const isExpanded = expandedItems.includes(item.name)

          if (item.children) {
            return (
              <div key={item.name}>
                <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(item.name)}>
                  <div className="flex items-center gap-1">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex-1 flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-1 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 ml-6 rounded-lg text-sm transition-colors",
                          pathname === child.href
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t space-y-2">
        <Separator className="my-2" />
        <Link href="/">
          <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-muted">
            <Home className="h-4 w-4 mr-2" />
            View Website
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:bg-background lg:shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="sm" className="fixed top-4 left-4 z-40 bg-background shadow-md">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
