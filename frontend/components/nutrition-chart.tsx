"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { products } from "@/lib/products"

interface NutritionChartProps {
  selectedProducts: string[]
}

export function NutritionChart({ selectedProducts }: NutritionChartProps) {
  // Calculate total nutrition from selected products
  const totalNutrition = selectedProducts.reduce(
    (acc, productId) => {
      const product = products.find((p) => p.id === productId)
      if (product?.nutrition) {
        acc.calories += product.nutrition.calories
        acc.protein += product.nutrition.protein
        acc.fiber += product.nutrition.fiber
        acc.vitaminC += product.nutrition.vitaminC
        acc.potassium += product.nutrition.potassium
      }
      return acc
    },
    { calories: 0, protein: 0, fiber: 0, vitaminC: 0, potassium: 0 },
  )

  const nutritionData = [
    { name: "Calories", value: totalNutrition.calories, max: 2000, unit: "kcal", color: "bg-red-500" },
    { name: "Protein", value: totalNutrition.protein, max: 50, unit: "g", color: "bg-blue-500" },
    { name: "Fiber", value: totalNutrition.fiber, max: 25, unit: "g", color: "bg-green-500" },
    { name: "Vitamin C", value: totalNutrition.vitaminC, max: 90, unit: "mg", color: "bg-orange-500" },
    { name: "Potassium", value: totalNutrition.potassium, max: 3500, unit: "mg", color: "bg-purple-500" },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Nutrition Summary</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">Based on your selected items</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Select items to see nutrition information</p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {nutritionData.map((nutrient) => {
              const percentage = Math.min((nutrient.value / nutrient.max) * 100, 100)
              return (
                <div key={nutrient.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium">{nutrient.name}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {nutrient.value.toFixed(1)} {nutrient.unit}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}% of daily value</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
