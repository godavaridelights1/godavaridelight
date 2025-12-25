"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Package, Users, type LucideIcon } from "lucide-react"
import { AnimatedCounter } from "./animated-counter"

interface AdminStatsCardProps {
  title: string
  value: string | number
  change: string
  trend: "up" | "down"
  icon: string
  description: string
  prefix?: string
  suffix?: string
  animated?: boolean
}

const iconMap: Record<string, LucideIcon> = {
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
}

export function AdminStatsCard({
  title,
  value,
  change,
  trend,
  icon,
  description,
  prefix = "",
  suffix = "",
  animated = false,
}: AdminStatsCardProps) {
  const numericValue = typeof value === "string" ? Number.parseInt(value.replace(/[^\d]/g, "")) : value
  const Icon = iconMap[icon] || Package

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-full">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {animated && typeof numericValue === "number" ? (
            <AnimatedCounter end={numericValue} prefix={prefix} suffix={suffix} />
          ) : (
            `${prefix}${value}${suffix}`
          )}
        </div>
        <div className="flex items-center space-x-2 text-xs mt-2">
          <Badge
            variant={trend === "up" ? "default" : "destructive"}
            className={`flex items-center space-x-1 ${
              trend === "up"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
            }`}
          >
            {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{change}</span>
          </Badge>
          <span className="text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
