"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { products, type Product } from "@/lib/products"

interface NutritionChartProps {
  selectedProducts: string[]
}

export function NutritionChart({ selectedProducts }: NutritionChartProps) {
  const selectedProductObjects = selectedProducts
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[]

  const totalNutrition = selectedProductObjects.reduce(
    (total, product) => ({
      calories: total.calories + product.nutrition.calories,
      protein: total.protein + product.nutrition.protein,
      fiber: total.fiber + product.nutrition.fiber,
      vitaminC: total.vitaminC + product.nutrition.vitaminC,
      potassium: total.potassium + product.nutrition.potassium,
      sugar: total.sugar + product.nutrition.sugar,
    }),
    { calories: 0, protein: 0, fiber: 0, vitaminC: 0, potassium: 0, sugar: 0 },
  )

  const totalPrice = selectedProductObjects.reduce((total, product) => total + product.price, 0)

  // Daily recommended values for progress bars
  const dailyValues = {
    calories: 2000,
    protein: 50,
    fiber: 25,
    vitaminC: 90,
    potassium: 3500,
    sugar: 50,
  }

  const nutritionItems = [
    { name: "Calories", value: totalNutrition.calories, unit: "", daily: dailyValues.calories, color: "bg-red-500" },
    { name: "Protein", value: totalNutrition.protein, unit: "g", daily: dailyValues.protein, color: "bg-blue-500" },
    { name: "Fiber", value: totalNutrition.fiber, unit: "g", daily: dailyValues.fiber, color: "bg-green-500" },
    {
      name: "Vitamin C",
      value: totalNutrition.vitaminC,
      unit: "mg",
      daily: dailyValues.vitaminC,
      color: "bg-orange-500",
    },
    {
      name: "Potassium",
      value: totalNutrition.potassium,
      unit: "mg",
      daily: dailyValues.potassium,
      color: "bg-purple-500",
    },
    { name: "Sugar", value: totalNutrition.sugar, unit: "g", daily: dailyValues.sugar, color: "bg-pink-500" },
  ]

  if (selectedProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Select products to see nutrition information</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Summary</CardTitle>
        <p className="text-muted-foreground">
          Total for {selectedProducts.length} items • ${totalPrice.toFixed(2)}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {nutritionItems.map((item) => {
          const percentage = Math.min((item.value / item.daily) * 100, 100)

          return (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground">
                  {item.value.toFixed(1)}
                  {item.unit} ({percentage.toFixed(0)}% DV)
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          )
        })}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">* Percent Daily Values are based on a 2,000 calorie diet</p>
        </div>
      </CardContent>
    </Card>
  )
}
