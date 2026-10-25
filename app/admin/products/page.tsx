"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ImageUpload } from "@/components/image-upload"
import { MultiImageUpload } from "@/components/multi-image-upload"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Package, TrendingUp, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { ResponsiveImage as Image } from "@/components/responsive-image"
import type { Product } from "@/lib/types"

const productCategories = [
  "Traditional Putharekulu",
  "Premium Collection",
  "Festival Specials",
  "Gift Hampers",
]

async function getResponseError(response: Response, fallback: string) {
  const responseText = await response.text()
  if (response.status === 413) {
    return "The request is too large. Product images are uploaded separately; please retry with fewer or smaller images."
  }

  try {
    const body = JSON.parse(responseText) as { error?: string }
    return body.error || fallback
  } catch {
    return responseText || fallback
  }
}

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [productList, setProductList] = useState<Product[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newProductImages, setNewProductImages] = useState<Array<{ url: string; altText?: string; isPrimary?: boolean }>>([])
  const [editProductImages, setEditProductImages] = useState<Array<{ id?: string; url: string; altText?: string; isPrimary?: boolean }>>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newDescription, setNewDescription] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [newIngredients, setNewIngredients] = useState<string[]>([])
  const [editIngredients, setEditIngredients] = useState<string[]>([])
  const [newIngredientInput, setNewIngredientInput] = useState("")
  const [editIngredientInput, setEditIngredientInput] = useState("")
  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?includeImages=false&includeArchived=true', {
        cache: 'no-store'
      })
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProductList(data.data || [])
    } catch (error: any) {
      console.error('Fetch error:', error)
      toast.error(error.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = productList.filter((product) => {
    if (!product || !product.name) return false

    const name = product.name.toLowerCase()
    const description = (product.description ?? "").toLowerCase()
    const category = (product.category ?? "").toLowerCase()
    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      description.includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || category.includes(categoryFilter.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "archived" && product.isArchived) ||
      (statusFilter === "in-stock" && product.inStock) ||
      (statusFilter === "out-of-stock" && !product.inStock && !product.isArchived)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAddProduct = async (formData: FormData) => {
    try {
      setSubmitting(true)
      
      if (newProductImages.length === 0) {
        toast.error("Please upload at least one product image")
        setSubmitting(false)
        return
      }

      const productData = {
        name: formData.get("name") as string,
        description: newDescription,
        price: Number(formData.get("price")),
        originalPrice: formData.get("originalPrice") ? Number(formData.get("originalPrice")) : null,
        image: newProductImages[0]?.url || "/placeholder.svg?height=300&width=300",
        images: newProductImages,
        category: formData.get("category") as string,
        inStock: formData.get("inStock") === "on",
        featured: formData.get("featured") === "on",
        weight: formData.get("weight") as string,
        ingredients: newIngredients,
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error(await getResponseError(response, 'Failed to add product'))
      }

      const result = await response.json()
      setProductList((prev) => [result.data, ...prev])
      setIsAddOpen(false)
      setNewProductImages([])
      setNewDescription("")
      setNewIngredients([])
      setNewIngredientInput("")
      toast.success("Product added successfully!")
    } catch (error: any) {
      console.error('Add product error:', error)
      toast.error(error.message || 'Failed to add product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditProduct = async (formData: FormData) => {
    if (!selectedProduct) return

    try {
      setSubmitting(true)
      
      if (editProductImages.length === 0) {
        toast.error("Please keep at least one product image")
        setSubmitting(false)
        return
      }

      const productData = {
        name: formData.get("name") as string,
        description: editDescription,
        price: Number(formData.get("price")),
        originalPrice: formData.get("originalPrice") ? Number(formData.get("originalPrice")) : null,
        image: editProductImages[0]?.url || selectedProduct.image,
        images: editProductImages,
        imagesToDelete: imagesToDelete,
        category: formData.get("category") as string,
        inStock: formData.get("inStock") === "on",
        featured: formData.get("featured") === "on",
        weight: formData.get("weight") as string,
        ingredients: editIngredients,
      }

      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error(await getResponseError(response, 'Failed to update product'))
      }

      const result = await response.json()
      setProductList((prev) => prev.map((p) => (p.id === selectedProduct.id ? result.data : p)))
      setIsEditOpen(false)
      setSelectedProduct(null)
      setEditProductImages([])
      setEditDescription("")
      setEditIngredients([])
      setEditIngredientInput("")
      setImagesToDelete([])
      toast.success("Product updated successfully!")
    } catch (error: any) {
      console.error('Update product error:', error)
      toast.error(error.message || 'Failed to update product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Remove this product from the store? Products with order history will be archived so past orders remain intact.')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(await getResponseError(response, 'Failed to delete product'))
      }

      const result = await response.json()
      if (result.data?.archived) {
        setProductList((prev) =>
          prev.map((product) =>
            product.id === productId
              ? { ...product, isArchived: true, inStock: false, featured: false }
              : product
          )
        )
        toast.success("Product archived; its past order history is preserved.")
      } else {
        setProductList((prev) => prev.filter((p) => p.id !== productId))
        toast.success("Product deleted successfully!")
      }
    } catch (error: any) {
      console.error('Delete product error:', error)
      toast.error(error.message || 'Failed to delete product')
    }
  }

  const handleRestoreProduct = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: false }),
      })

      if (!response.ok) {
        throw new Error(await getResponseError(response, 'Failed to restore product'))
      }

      const result = await response.json()
      setProductList((prev) => prev.map((item) => item.id === product.id ? result.data : item))
      toast.success("Product restored. Set it in stock to show it in the store.")
    } catch (error) {
      console.error('Restore product error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to restore product')
    }
  }

  const openEditDialog = async (product: Product) => {
    setSelectedProduct(product)
    setEditProductImages([])
    setImagesToDelete([])
    setEditDescription(product.description || "")
    setEditIngredients((product as any).ingredients || [])
    setEditIngredientInput("")
    setIsEditOpen(true)
    setEditLoading(true)

    try {
      const response = await fetch(`/api/products/${product.id}`, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(await getResponseError(response, 'Failed to load product images'))
      }
      const result = await response.json()
      const productDetails = result.data as Product
      setSelectedProduct(productDetails)
      setEditDescription(productDetails.description || "")
      setEditIngredients(productDetails.ingredients || [])
      setEditProductImages(
        productDetails.images?.length
          ? productDetails.images.map((image, index) => ({
              id: image.id,
              url: image.url,
              altText: image.altText,
              isPrimary: image.isPrimary,
              displayOrder: image.displayOrder ?? index,
            }))
          : [{ url: productDetails.image, altText: productDetails.name, isPrimary: true }]
      )
    } catch (error) {
      console.error('Load product details error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to load product details')
      setIsEditOpen(false)
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <AdminHeader title="Products" description="Manage your product catalog and inventory" />

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      ) : (
      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{productList.filter(p => p).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                  <p className="text-2xl font-bold">{productList.filter((p) => p && p.inStock).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Featured</p>
                  <p className="text-2xl font-bold">{productList.filter((p) => p && p.featured).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold">{productList.filter((p) => p && !p.inStock).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Add product details, select a category, and upload product images.
                </DialogDescription>
              </DialogHeader>
              <form action={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <RichTextEditor
                    id="description"
                    value={newDescription}
                    onChange={setNewDescription}
                    placeholder="Enter product description..."
                    required={true}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input id="price" name="price" type="number" required />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input id="originalPrice" name="originalPrice" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight</Label>
                    <Input id="weight" name="weight" placeholder="250g" required />
                  </div>
                </div>
                <div>
                  <Label>Product Images</Label>
                  <MultiImageUpload
                    images={newProductImages}
                    onImagesChange={setNewProductImages}
                    maxImages={10}
                  />
                </div>
                <div>
                  <Label htmlFor="new-ingredients">Ingredients</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id="new-ingredients"
                        placeholder="Enter ingredient (e.g., Rice flour, Pure ghee)"
                        value={newIngredientInput}
                        onChange={(e) => setNewIngredientInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            if (newIngredientInput.trim()) {
                              setNewIngredients([...newIngredients, newIngredientInput.trim()])
                              setNewIngredientInput("")
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newIngredientInput.trim()) {
                            setNewIngredients([...newIngredients, newIngredientInput.trim()])
                            setNewIngredientInput("")
                          }
                        }}
                        className="px-4"
                      >
                        Add
                      </Button>
                    </div>
                    {newIngredients.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newIngredients.map((ingredient, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-2">
                            {ingredient}
                            <button
                              type="button"
                              onClick={() => setNewIngredients(newIngredients.filter((_, i) => i !== index))}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="inStock" name="inStock" defaultChecked />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" name="featured" />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center">
                        {productList.length === 0 ? (
                          <div className="space-y-3">
                            <p className="text-muted-foreground">No products yet. Add a food product to show it in the store.</p>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(true)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add your first product
                            </Button>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No products match these filters.</p>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="min-w-[200px]">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 relative rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="font-medium truncate">{product.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">₹{product.price}</p>
                          {product.originalPrice && (
                            <p className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.inStock ? "default" : "destructive"}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {product.featured && (
                            <Badge variant="secondary" className="text-xs">
                              Featured
                            </Badge>
                          )}
                          {product.isArchived ? (
                            <Badge variant="outline" className="text-xs">Archived</Badge>
                          ) : (
                            <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
                              {product.inStock ? "Active" : "Inactive"}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" aria-label={`Actions for ${product.name}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" side="top" className="w-48">
                            <DropdownMenuItem
                              disabled={product.isArchived}
                              onSelect={() => void openEditDialog(product)}
                            >
                              <Edit className="h-4 w-4" />
                              Edit Product
                            </DropdownMenuItem>
                            {product.isArchived && (
                              <DropdownMenuItem onSelect={() => void handleRestoreProduct(product)}>
                                Restore Product
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() => void handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product details, category, images, and inventory settings.
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              editLoading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading product images...
                </div>
              ) : (
              <form action={handleEditProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Product Name</Label>
                    <Input id="edit-name" name="name" defaultValue={selectedProduct.name} required />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      name="category"
                      defaultValue={selectedProduct.category || productCategories[0]}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProduct.category &&
                          !productCategories.includes(selectedProduct.category) && (
                            <SelectItem value={selectedProduct.category}>
                              {selectedProduct.category}
                            </SelectItem>
                          )}
                        {productCategories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <RichTextEditor
                    id="edit-description"
                    value={editDescription}
                    onChange={setEditDescription}
                    placeholder="Enter product description..."
                    required={true}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-price">Price (₹)</Label>
                    <Input id="edit-price" name="price" type="number" defaultValue={selectedProduct.price} required />
                  </div>
                  <div>
                    <Label htmlFor="edit-originalPrice">Original Price (₹)</Label>
                    <Input
                      id="edit-originalPrice"
                      name="originalPrice"
                      type="number"
                      defaultValue={selectedProduct.originalPrice}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-weight">Weight</Label>
                    <Input id="edit-weight" name="weight" defaultValue={selectedProduct.weight} required />
                  </div>
                </div>
                <div>
                  <Label>Product Images</Label>
                  <MultiImageUpload
                    images={editProductImages}
                    onImagesChange={setEditProductImages}
                    onImageDelete={(imageId) => {
                      if (imageId) {
                        setImagesToDelete((prev) => [...prev, imageId])
                      }
                    }}
                    maxImages={10}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-new-ingredients">Ingredients</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id="edit-new-ingredients"
                        placeholder="Enter ingredient (e.g., Rice flour, Pure ghee)"
                        value={editIngredientInput}
                        onChange={(e) => setEditIngredientInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            if (editIngredientInput.trim()) {
                              setEditIngredients([...editIngredients, editIngredientInput.trim()])
                              setEditIngredientInput("")
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (editIngredientInput.trim()) {
                            setEditIngredients([...editIngredients, editIngredientInput.trim()])
                            setEditIngredientInput("")
                          }
                        }}
                        className="px-4"
                      >
                        Add
                      </Button>
                    </div>
                    {editIngredients.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editIngredients.map((ingredient, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-2">
                            {ingredient}
                            <button
                              type="button"
                              onClick={() => setEditIngredients(editIngredients.filter((_, i) => i !== index))}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="edit-inStock" name="inStock" defaultChecked={selectedProduct.inStock} />
                    <Label htmlFor="edit-inStock">In Stock</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="edit-featured" name="featured" defaultChecked={selectedProduct.featured} />
                    <Label htmlFor="edit-featured">Featured Product</Label>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Product'
                  )}
                </Button>
              </form>
              )
            )}
          </DialogContent>
        </Dialog>
      </div>
      )}
    </div>
  )
}
