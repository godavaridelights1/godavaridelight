"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, X, GripVertical, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface UploadedImage {
  id?: string
  url: string
  file?: File
  altText?: string
  isPrimary?: boolean
  displayOrder?: number
}

interface MultiImageUploadProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  onImageDelete?: (imageId?: string) => void
  maxImages?: number
  maxFileSize?: number // in MB
}

export function MultiImageUpload({
  images: initialImages,
  onImagesChange,
  onImageDelete,
  maxImages = 10,
  maxFileSize = 5, // 5MB
}: MultiImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)

  // Sync initialImages when they change (e.g., when editing a product)
  useEffect(() => {
    setImages(initialImages)
  }, [initialImages])

  const handleFiles = useCallback(
    async (files: FileList) => {
      const newImages: UploadedImage[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Max size is ${maxFileSize}MB`)
          continue
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`File ${file.name} is not an image`)
          continue
        }

        // Check if we've reached max images
        if (images.length + newImages.length >= maxImages) {
          toast.error(`Maximum ${maxImages} images allowed`)
          break
        }

        // Create preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          const newImage: UploadedImage = {
            id: `new-${Date.now()}-${Math.random()}`,
            url,
            file,
            isPrimary: images.length + newImages.length === 0,
            displayOrder: images.length + newImages.length,
          }
          newImages.push(newImage)

          if (newImages.length === Object.keys(files).length) {
            const updatedImages = [...images, ...newImages]
            setImages(updatedImages)
            onImagesChange(updatedImages)
            toast.success(`${newImages.length} image(s) added`)
          }
        }
        reader.readAsDataURL(file)
      }
    },
    [images, maxImages, maxFileSize, onImagesChange]
  )

  const handleDrag = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    },
    []
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeImage = (index: number) => {
    const imageToRemove = images[index]
    if (imageToRemove?.id && onImageDelete) {
      onImageDelete(imageToRemove.id)
    }
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesChange(updatedImages)
    toast.success("Image removed")
  }

  const setPrimaryImage = (index: number) => {
    const updatedImages = images.map((img, idx) => ({
      ...img,
      isPrimary: idx === index,
    }))
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const moveImageUp = (index: number) => {
    if (index === 0) return
    const updatedImages = [...images]
    ;[updatedImages[index - 1], updatedImages[index]] = [updatedImages[index], updatedImages[index - 1]]
    updatedImages.forEach((img, idx) => {
      img.displayOrder = idx
    })
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return
    const updatedImages = [...images]
    ;[updatedImages[index], updatedImages[index + 1]] = [updatedImages[index + 1], updatedImages[index]]
    updatedImages.forEach((img, idx) => {
      img.displayOrder = idx
    })
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          ref={dragRef}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            disabled={isUploading}
          />

          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-lg font-medium text-gray-900 mb-1">
            Drag and drop your images here
          </p>
          <p className="text-sm text-gray-600 mb-4">
            or click to browse
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            Select Images
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            Max {maxImages} images • Max {maxFileSize}MB per image • JPG, PNG, WebP
          </p>
        </div>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Uploaded Images ({images.length}/{maxImages})
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                {/* Image */}
                <div className="relative w-full h-32 bg-gray-100">
                  <Image
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  {/* Remove button */}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                    className="gap-1"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>

                  {/* Set as primary */}
                  {!image.isPrimary && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setPrimaryImage(index)}
                      className="gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Primary
                    </Button>
                  )}
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 right-2 flex gap-2 justify-between">
                  {image.isPrimary && (
                    <Badge className="bg-green-500 text-white text-xs">Primary</Badge>
                  )}
                  <Badge className="bg-blue-500 text-white text-xs">{index + 1}</Badge>
                </div>

                {/* Order controls */}
                <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => moveImageUp(index)}
                    disabled={index === 0}
                    className="text-xs h-6"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => moveImageDown(index)}
                    disabled={index === images.length - 1}
                    className="text-xs h-6"
                  >
                    ↓
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <p>
          <strong>💡 Tip:</strong> The first image will be used as the product thumbnail. You can reorder images by
          clicking the up/down arrows. All images should be at least 500x500px for best quality.
        </p>
      </div>
    </div>
  )
}
