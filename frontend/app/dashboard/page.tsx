import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Package, TrendingUp, DollarSign } from "lucide-react"
import { mockSubscription, mockOrders, mockNutritionGoals } from "@/lib/dashboard"
import Link from "next/link"

export default function DashboardPage() {
  const totalSpent = mockOrders.reduce((sum, order) => sum + order.total, 0)
  const deliveredOrders = mockOrders.filter((order) => order.status === "delivered").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your HealthFit overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscription</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSubscription.planName}</div>
            <p className="text-xs text-muted-foreground">Next delivery in 5 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrders.length}</div>
            <p className="text-xs text-muted-foreground">{deliveredOrders} delivered successfully</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month: ${mockSubscription.price}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your active meal box plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{mockSubscription.planName}</p>
                <p className="text-sm text-muted-foreground">${mockSubscription.price}/month</p>
              </div>
              <Badge variant={mockSubscription.status === "active" ? "default" : "secondary"}>
                {mockSubscription.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Next Delivery</p>
              <p className="text-sm text-muted-foreground">{mockSubscription.nextDelivery}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/dashboard/subscription">Manage Subscription</Link>
              </Button>
              <Button variant="outline" size="sm">
                Pause Delivery
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Goals</CardTitle>
            <CardDescription>Your daily nutrition progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockNutritionGoals.slice(0, 3).map((goal) => {
              const percentage = Math.min((goal.current / goal.target) * 100, 100)
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{goal.name}</span>
                    <span>
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
            <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
              <Link href="/dashboard/nutrition">View All Goals</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your latest HealthFit deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                  <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
            <Link href="/dashboard/orders">View All Orders</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
