"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { getProductsByCategory, products as allProducts } from "@/lib/products"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  // load favorites from localStorage on mount and whenever storage changes
  useEffect(() => {
    const loadFavs = () => {
      try {
        const favs = JSON.parse(localStorage.getItem("favorites") || "[]") as string[]
        setFavoriteIds(favs)
      } catch {
        setFavoriteIds([])
      }
    }

    loadFavs()
    // listen to storage events so multiple tabs stay in sync
    window.addEventListener("storage", loadFavs)
    return () => window.removeEventListener("storage", loadFavs)
  }, [])

  // filtered by category first (uses lib helper)
  const categoryFiltered = useMemo(() => {
    return getProductsByCategory(selectedCategory)
  }, [selectedCategory])

  // apply favorites filter + search
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return categoryFiltered
      .filter((product) => {
        if (showFavoritesOnly && !favoriteIds.includes(product.id)) return false
        if (!q) return true
        return (
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q)
        )
      })
  }, [categoryFiltered, searchQuery, showFavoritesOnly, favoriteIds])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-balance">Fresh Fruits & Healthy Items</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Discover our selection of premium fruits and healthy items — add to favorites for quick access.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-md mx-auto md:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly((s) => !s)}
              className="px-3 py-1 text-sm"
            >
              {showFavoritesOnly ? "Showing Favorites" : "Show Favorites"}
            </Button>

            <div className="text-sm text-muted-foreground">
              Favorites: <span className="font-medium text-foreground">{favoriteIds.length}</span>
            </div>
          </div>
        </div>

        {/* simple category buttons */}
        <div className="flex gap-3 justify-center mb-6 flex-wrap">
          {["All", "Fruits", "Vegetables", "Pulses", "Dry Fruits", "Sprouts", "Citrus"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-sm ${selectedCategory === cat ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
