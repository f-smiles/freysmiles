import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/server/db"
import { orderItem } from "@/server/schema"
import { desc } from "drizzle-orm"
import Sales from "./sales"

export const revalidate = 0

export default async function DashboardAnalytics() {
  const totalOrders = await db.query.orderItem.findMany({
    orderBy: [desc(orderItem.id)],
    limit: 10,
    with: {
      order: { with: { user: true } },
      product: true,
      productVariant: { with: { variantImages: true }},
    }
  })

  if (totalOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No orders yet.</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (totalOrders.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Analytics</CardTitle>
          <CardDescription>Check your sales, customers, and more</CardDescription>
        </CardHeader>
        <CardContent>
          <Sales totalOrders={totalOrders} />
        </CardContent>
      </Card>
    )
  }
}