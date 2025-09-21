"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Minus, X } from "lucide-react"
import { products, type Product } from "@/lib/products"
import type { SubscriptionPlan } from "@/lib/subscriptions"

interface ProductCustomizerProps {
  selectedPlan: SubscriptionPlan
  selectedProducts: string[]
  onProductsChange: (products: string[]) => void
}

export function ProductCustomizer({ selectedPlan, selectedProducts, onProductsChange }: ProductCustomizerProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const availableProducts = products.filter((product) => product.inStock)
  const selectedProductObjects = selectedProducts
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[]

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  const canAddMore = totalItems < selectedPlan.maxItems

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const currentTotal = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
    const currentProductQty = quantities[productId] || 0
    const difference = newQuantity - currentProductQty

    if (currentTotal + difference <= selectedPlan.maxItems && newQuantity >= 0) {
      const newQuantities = { ...quantities, [productId]: newQuantity }
      setQuantities(newQuantities)

      // Update selected products based on quantities
      const newSelectedProducts: string[] = []
      Object.entries(newQuantities).forEach(([id, qty]) => {
        for (let i = 0; i < qty; i++) {
          newSelectedProducts.push(id)
        }
      })
      onProductsChange(newSelectedProducts)
    }
  }

  const removeProduct = (productId: string) => {
    const newQuantities = { ...quantities }
    delete newQuantities[productId]
    setQuantities(newQuantities)

    const newSelectedProducts: string[] = []
    Object.entries(newQuantities).forEach(([id, qty]) => {
      for (let i = 0; i < qty; i++) {
        newSelectedProducts.push(id)
      }
    })
    onProductsChange(newSelectedProducts)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Customize Your {selectedPlan.name}</h2>
        <p className="text-muted-foreground text-base sm:text-lg px-4">
          Select up to {selectedPlan.maxItems} items for your monthly delivery.
        </p>
        <div className="mt-4">
          <Badge variant={totalItems === selectedPlan.maxItems ? "default" : "outline"} className="text-sm">
            {totalItems} / {selectedPlan.maxItems} items selected
          </Badge>
        </div>
      </div>

      {totalItems === selectedPlan.maxItems && (
        <Alert>
          <AlertDescription className="text-sm">
            You've reached the maximum number of items for your {selectedPlan.name}. Remove items to add different ones.
          </AlertDescription>
        </Alert>
      )}

      {/* Selected Products */}
      {selectedProductObjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Your Selected Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(quantities).map(([productId, quantity]) => {
                if (quantity === 0) return null
                const product = products.find((p) => p.id === productId)
                if (!product) return null

                return (
                  <div key={productId} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base truncate">{product.name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">${product.price} each</p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent"
                        onClick={() => handleQuantityChange(productId, quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent"
                        onClick={() => handleQuantityChange(productId, quantity + 1)}
                        disabled={!canAddMore}
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9 ml-1"
                        onClick={() => removeProduct(productId)}
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Available Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableProducts.map((product) => {
              const currentQuantity = quantities[product.id] || 0
              const isSelected = currentQuantity > 0

              return (
                <div
                  key={product.id}
                  className={`border rounded-lg p-3 sm:p-4 transition-all ${
                    isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  }`}
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-24 sm:h-32 object-cover rounded mb-2 sm:mb-3"
                  />
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">${product.price}</p>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {isSelected ? (
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 bg-transparent"
                        onClick={() => handleQuantityChange(product.id, currentQuantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[2rem] text-center">{currentQuantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 bg-transparent"
                        onClick={() => handleQuantityChange(product.id, currentQuantity + 1)}
                        disabled={!canAddMore}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full h-8 text-xs sm:text-sm"
                      onClick={() => handleQuantityChange(product.id, 1)}
                      disabled={!canAddMore}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
