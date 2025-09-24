"use client"

import { Button } from "@/components/ui/button"
import { categories } from "@/lib/products"

interface ProductFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function ProductFilters({ selectedCategory, onCategoryChange }: ProductFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className="rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
