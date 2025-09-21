import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { OrderSummary } from "@/lib/checkout"

interface OrderSummaryProps {
  orderSummary: OrderSummary
}

export function OrderSummaryCard({ orderSummary }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subscription Plan */}
        <div>
          <h4 className="font-semibold mb-2">Subscription Plan</h4>
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span>{orderSummary.subscriptionPlan.name}</span>
            <span className="font-medium">${orderSummary.subscriptionPlan.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Selected Products */}
        <div>
          <h4 className="font-semibold mb-2">Selected Items</h4>
          <div className="space-y-2">
            {orderSummary.selectedProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>
                  {product.name} x{product.quantity}
                </span>
                <span>₹{(product.price * product.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{orderSummary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{orderSummary.shipping === 0 ? "Free" : `$${orderSummary.shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>₹{orderSummary.tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{orderSummary.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm text-primary font-medium">Monthly Subscription</p>
          <p className="text-xs text-muted-foreground">
            You'll be charged ₹{orderSummary.total.toFixed(2)} every month. Cancel anytime.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
