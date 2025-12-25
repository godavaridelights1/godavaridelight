"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Package, FolderOpen } from "lucide-react"
import { toast } from "sonner"

interface CategoryStats {
  category: string
  productCount: number
  inStockCount: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      
      // Group products by category
      const categoryMap = new Map<string, { total: number; inStock: number }>()
      
      data.data.forEach((product: any) => {
        const category = product.category || 'Uncategorized'
        if (!categoryMap.has(category)) {
          categoryMap.set(category, { total: 0, inStock: 0 })
        }
        const stats = categoryMap.get(category)!
        stats.total++
        if (product.inStock) stats.inStock++
      })
      
      const categoryStats: CategoryStats[] = Array.from(categoryMap.entries()).map(
        ([category, stats]) => ({
          category,
          productCount: stats.total,
          inStockCount: stats.inStock,
        })
      )
      
      setCategories(categoryStats.sort((a, b) => b.productCount - a.productCount))
    } catch (error: any) {
      console.error('Fetch error:', error)
      toast.error(error.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0)

  return (
    <div className="flex flex-col">
      <AdminHeader title="Product Categories" description="Manage and view product categories" />

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Categories</p>
                    <p className="text-2xl font-bold">{categories.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{totalProducts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg per Category</p>
                    <p className="text-2xl font-bold">
                      {categories.length > 0 ? Math.round(totalProducts / categories.length) : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories List */}
          <Card>
            <CardHeader>
              <CardTitle>Categories ({categories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No categories found</p>
                  <p className="text-sm">Add products to create categories automatically</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <Card key={category.category} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <FolderOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{category.category}</h3>
                              <p className="text-sm text-muted-foreground">
                                {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">In Stock:</span>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              {category.inStockCount}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Out of Stock:</span>
                            <Badge variant="destructive">
                              {category.productCount - category.inStockCount}
                            </Badge>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(category.productCount / totalProducts) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground text-center">
                            {((category.productCount / totalProducts) * 100).toFixed(1)}% of total products
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
