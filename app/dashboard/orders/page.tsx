import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { formatDistance, subMinutes } from "date-fns"

import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { orders } from "@/server/schema"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format-price"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontalIcon } from "lucide-react"


export default async function DashboardOrders() {
  const user = await auth()

  if (!user) redirect("/auth/login")

  const userOrderHistory = await db.query.orders.findMany({
    where: eq(orders.userID, user.user.id),
    with: {
      orderItem: {
        with: {
          product: true,
          productVariant: { with: { variantImages: true } },
          order: true,
        }
      }
    },
  })

  return (
    <Table>
      <TableCaption>A list of your recent orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Order #</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date Placed</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userOrderHistory.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>
              <Badge
                className={cn(
                  "text-xs font-normal rounded-full",
                  order.status === "pending" ? "bg-muted text-primary hover:bg-muted" : null,
                  order.status === "paid" ? "bg-success text-white hover:bg-success" : null,
                )}
              >
                {order.status ?? "pending"}
              </Badge>
            </TableCell>
            <TableCell>{formatDistance(subMinutes(order.created!, 0), new Date(), { addSuffix: true })}</TableCell>
            <TableCell>{formatPrice(order.total)}</TableCell>
            <TableCell>
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger className="float-right mx-4"><MoreHorizontalIcon className="w-4 h-4" /></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <DialogTrigger>View Order</DialogTrigger>
                    </DropdownMenuItem>
                    {order.receiptURL ? (
                      <DropdownMenuItem>
                        <Link href={order.receiptURL} target={"_blank"}>Download Receipt</Link>
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Order #{order.id}</DialogTitle>
                    <DialogDescription>Date Ordered: {order.created?.toLocaleDateString()}</DialogDescription>
                  </DialogHeader>

                  <Card>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.orderItem.map(({ product, productVariant, quantity }) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">
                                <Image className="w-16 h-16" src={productVariant.variantImages[0].url} alt={`${product.title} - ${productVariant.variantName}`} width={320} height={320} priority />
                              </TableCell>
                              <TableCell>{`${product.title} - ${productVariant.variantName}`}</TableCell>
                              <TableCell>
                                <div className="w-4 h-4 mx-auto rounded-full" style={{ background: productVariant.color }} />
                              </TableCell>
                              <TableCell className="text-center">${product.price}</TableCell>
                              <TableCell className="text-center">{quantity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                      <p className="text-md">Pickup Location: {order.pickupLocation}</p>
                      <p className="text-md">Total: ${order.total}</p>
                    </CardFooter>
                  </Card>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
