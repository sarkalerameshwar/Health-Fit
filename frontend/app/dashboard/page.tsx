// UserSubscriptionAndOrders.tsx
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns"; // optional - for readable dates

// Types (adjust to your actual shapes)
type Subscription = {
  id: string;
  planName: string;
  status: "active" | "cancelled" | "expired" | string;
  startedAt?: string; // ISO date
  expiresAt?: string; // ISO date
};

type Order = {
  id: string;
  total: number;
  createdAt: string; // ISO date
  status?: string;
  items?: { name: string; qty?: number }[];
};

type Props = {
  subscriptions?: Subscription[]; // all subscriptions from server
  orders?: Order[]; // all orders from server
  maxRecent?: number; // how many recent orders to show
  onViewAllOrders?: () => void;
  onManageSubscription?: (subscriptionId: string) => void;
};

export default function UserSubscriptionAndOrders({
  subscriptions = [],
  orders = [],
  maxRecent = 5,
  onViewAllOrders,
  onManageSubscription,
}: Props) {
  // find active subscription (most recent active if multiple)
  const activeSubscription =
    [...subscriptions]
      .filter((s) => s.status === "active")
      .sort(
        (a, b) =>
          +(new Date(b.startedAt ?? 0)).valueOf() - +(new Date(a.startedAt ?? 0)).valueOf()
      )[0] ?? null;

  // sort orders by createdAt desc and take first maxRecent
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        +(new Date(b.createdAt)).valueOf() - +(new Date(a.createdAt)).valueOf()
    )
    .slice(0, maxRecent);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User</CardTitle>
        <CardDescription>Active subscription & recent orders</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Active subscription */}
        <section>
          <h3 className="text-sm font-medium mb-2">Active subscription</h3>

          {activeSubscription ? (
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold">{activeSubscription.planName}</p>
                {activeSubscription.startedAt && (
                  <p className="text-sm text-muted-foreground">
                    Started: {format(new Date(activeSubscription.startedAt), "dd MMM yyyy")}
                  </p>
                )}
                {activeSubscription.expiresAt && (
                  <p className="text-sm text-muted-foreground">
                    Expires: {format(new Date(activeSubscription.expiresAt), "dd MMM yyyy")}
                  </p>
                )}
                <p className="text-sm mt-1">Status: <span className="font-medium">{activeSubscription.status}</span></p>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => onManageSubscription?.(activeSubscription.id)}
                >
                  Manage
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No active subscription.
            </div>
          )}
        </section>

        <hr />

        {/* Recent orders */}
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Recent orders</h3>
            <Button variant="ghost" size="sm" onClick={() => onViewAllOrders?.()}>
              View all
            </Button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-3">No recent orders.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {recentOrders.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <div>
                    <p className="text-sm font-medium">Order #{o.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.items && o.items.length > 0
                        ? `${o.items.length} item${o.items.length > 1 ? "s" : ""}`
                        : "—"}{" "}
                      • {o.status ?? "—"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">₹{o.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(o.createdAt), "dd MMM yyyy")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
