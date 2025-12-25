"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Search } from "lucide-react"
import type { Product } from "@/lib/types"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [priceRange, setPriceRange] = useState("all")

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching products...')
      const response = await fetch('/api/products?includeImages=true', {
        cache: 'no-store'
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error('Failed to load products')
      }
      
      const result = await response.json()
      console.log('Products API result:', result)
      console.log('Products data:', result.data)
      console.log('Number of products:', result.data?.length)
      
      const productsData = result.data || []
      console.log('Setting products:', productsData)
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    console.log('Filtering products...')
    console.log('Total products:', products.length)
    console.log('Search query:', searchQuery)
    console.log('Selected category:', selectedCategory)
    console.log('Price range:', priceRange)
    console.log('Sort by:', sortBy)
    
    let filtered = [...products]
    console.log('After copy:', filtered.length)

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      console.log('After search filter:', filtered.length)
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => 
        product.category && product.category.toLowerCase().includes(selectedCategory.toLowerCase())
      )
      console.log('After category filter:', filtered.length)
    }

    // Filter by price range
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-300":
          filtered = filtered.filter((product) => product.price < 300)
          break
        case "300-500":
          filtered = filtered.filter((product) => product.price >= 300 && product.price <= 500)
          break
        case "500-800":
          filtered = filtered.filter((product) => product.price >= 500 && product.price <= 800)
          break
        case "above-800":
          filtered = filtered.filter((product) => product.price > 800)
          break
      }
      console.log('After price filter:', filtered.length)
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    console.log('Final filtered products:', filtered.length)
    return filtered
  }, [products, searchQuery, selectedCategory, sortBy, priceRange])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Our Products</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our complete range of authentic Putharekulu varieties, each crafted with traditional recipes and
              premium ingredients.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="gift">Gift Hampers</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-300">Under ₹300</SelectItem>
                  <SelectItem value="300-500">₹300 - ₹500</SelectItem>
                  <SelectItem value="500-800">₹500 - ₹800</SelectItem>
                  <SelectItem value="above-800">Above ₹800</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="featured">Featured First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("")}>
                Search: {searchQuery} ×
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
                Category: {selectedCategory} ×
              </Badge>
            )}
            {priceRange !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange("all")}>
                Price: {priceRange} ×
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold">All Products</h1>
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setPriceRange("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
