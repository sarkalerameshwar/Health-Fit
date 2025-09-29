// components/product-card.tsx
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {/* Image is NOT a link anymore (so clicking it won't navigate) */}
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Favorites button (remains clickable) */}
        <button
          aria-label={`Add ${product.name} to favourites`}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1"
          onClick={(e) => {
            e.stopPropagation()
            // TODO: add your favorite handling here, e.g. toggle localStorage or call API
            const favs = JSON.parse(localStorage.getItem("hf-favs" ) || "[]")
            if (!favs.includes(product.id)) favs.push(product.id)
            localStorage.setItem("hf-favs", JSON.stringify(favs))
            // optional small feedback:
            // alert(`${product.name} added to favourites`)
          }}
        >
          <Heart className="h-4 w-4" />
        </button>

        {product.organic && <Badge className="absolute top-2 left-2 bg-primary">Organic</Badge>}
      </div>

      <CardContent className="p-4">
        {/* Title is plain text now so clicking it won't navigate */}
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{product.nutrition.calories} cal</div>
          <div className="text-xs text-muted-foreground">{product.category}</div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* View button does the navigation (only this button navigates) */}
        <Button
          className="w-full"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/products/${product.id}`)
          }}
        >
          View
        </Button>
      </CardFooter>
    </Card>
  )
}
