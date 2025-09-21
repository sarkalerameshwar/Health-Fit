"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, HeartFill, Star as StarOutline, Star } from "lucide-react"
import { getProductById } from "@/lib/products"
import Link from "next/link"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id)

  // Favorites state
  const [fav, setFav] = useState(false)

  // Ratings: store global ratings in localStorage as { [id]: number[] }
  const [avgRating, setAvgRating] = useState<number | null>(null)
  const [myRating, setMyRating] = useState<number | null>(null)
  const [ratingLoading, setRatingLoading] = useState(false)

  useEffect(() => {
    if (!product) return

    // init favorite
    try {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]") as string[]
      setFav(favs.includes(product.id))
    } catch {
      setFav(false)
    }

    // init ratings
    try {
      const ratingsMap = JSON.parse(localStorage.getItem("ratings") || "{}") as Record<string, number[]>
      const arr = ratingsMap[product.id] || []
      if (arr.length > 0) {
        const sum = arr.reduce((s, v) => s + v, 0)
        setAvgRating(Math.round((sum / arr.length) * 10) / 10) // one decimal
      } else {
        setAvgRating(null)
      }

      // user's personal rating
      const myRatings = JSON.parse(localStorage.getItem("myRatings") || "{}") as Record<string, number>
      if (myRatings && typeof myRatings[product.id] === "number") {
        setMyRating(myRatings[product.id])
      } else {
        setMyRating(null)
      }
    } catch {
      setAvgRating(null)
      setMyRating(null)
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-12 text-center">
          <h2 className="text-xl font-semibold mb-4">Product not found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find that item. It may have been removed.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const toggleFav = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    try {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]") as string[]
      let next: string[] = []
      if (favs.includes(product.id)) {
        next = favs.filter((id) => id !== product.id)
        setFav(false)
      } else {
        next = [...favs, product.id]
        setFav(true)
      }
      localStorage.setItem("favorites", JSON.stringify(next))
    } catch {
      setFav(!fav)
    }
  }

  const submitRating = (value: number) => {
    if (value < 1 || value > 5) return
    setRatingLoading(true)
    try {
      // update global ratings array
      const ratingsMap = JSON.parse(localStorage.getItem("ratings") || "{}") as Record<string, number[]>
      const arr = ratingsMap[product.id] || []
      arr.push(value)
      ratingsMap[product.id] = arr
      localStorage.setItem("ratings", JSON.stringify(ratingsMap))

      // update user's rating (so they see their own selection)
      const myRatings = JSON.parse(localStorage.getItem("myRatings") || "{}") as Record<string, number>
      myRatings[product.id] = value
      localStorage.setItem("myRatings", JSON.stringify(myRatings))

      // update UI
      const sum = arr.reduce((s, v) => s + v, 0)
      setAvgRating(Math.round((sum / arr.length) * 10) / 10)
      setMyRating(value)
    } catch (err) {
      console.error("rating save error", err)
    } finally {
      setRatingLoading(false)
    }
  }

  // render stars (clickable)
  function StarsDisplay({
    size = 20,
    interactive = true,
  }: {
    size?: number
    interactive?: boolean
  }) {
    const stars = [1, 2, 3, 4, 5]
    return (
      <div className="flex items-center gap-1">
        {stars.map((s) => {
          const filled = (myRating ?? 0) >= s
          return (
            <button
              key={s}
              type="button"
              aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
              onClick={(e) => {
                e.stopPropagation()
                if (!interactive || ratingLoading) return
                submitRating(s)
              }}
              className="p-1 rounded hover:bg-muted/60"
            >
              <StarOutline className={`h-${Math.floor(size / 4)} w-${Math.floor(size / 4)} ${filled ? "text-yellow-400" : "text-muted-foreground"}`} />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
            />
            {product.organic && (
              <Badge className="absolute top-4 left-4 bg-primary">
                <span className="mr-1">🌿</span>
                Organic
              </Badge>
            )}

            {/* Favorite button */}
            <button
              onClick={toggleFav}
              aria-label={fav ? "Remove favorite" : "Add to favorites"}
              className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow"
              title={fav ? "Remove favorite" : "Add to favorites"}
            >
              {fav ? <HeartFill className="h-5 w-5 text-primary" /> : <Heart className="h-5 w-5 text-muted-foreground" />}
            </button>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg">{product.description}</p>
            </div>

            {/* Rating area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <StarsDisplay interactive />
                </div>
                <div className="text-sm text-muted-foreground">
                  {avgRating ? (
                    <span>
                      Avg: <strong>{avgRating}</strong> / 5
                    </span>
                  ) : (
                    <span>No ratings yet</span>
                  )}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                {myRating ? <span>Your rating: <strong>{myRating}</strong> / 5</span> : <span>You haven't rated yet</span>}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-primary">✓</span>
                Health Benefits
              </h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Nutrition Information */}
        <Separator className="my-8" />
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Facts</CardTitle>
            <p className="text-muted-foreground">Per serving</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Calories</span>
                <span className="font-bold">{product.nutrition.calories ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Protein</span>
                <span className="font-bold">{product.nutrition.protein ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Fiber</span>
                <span className="font-bold">{product.nutrition.fiber ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Vitamin C</span>
                <span className="font-bold">{product.nutrition.vitaminC ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Potassium</span>
                <span className="font-bold">{product.nutrition.potassium ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Sugar</span>
                <span className="font-bold">{product.nutrition.sugar ?? "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
