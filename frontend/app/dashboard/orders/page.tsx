import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Package } from "lucide-react"
import { mockOrders } from "@/lib/dashboard"

export default function OrdersPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "processing":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">View and track all your HealthFit orders.</p>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                  <CardDescription>Ordered on {order.date}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                  <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Items ({order.items.length})</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.trackingNumber && (
                  <div>
                    <h4 className="font-semibold mb-1">Tracking Number</h4>
                    <p className="text-sm text-muted-foreground font-mono">{order.trackingNumber}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  {order.status === "shipped" && (
                    <Button variant="outline" size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      Track Package
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
