import Image from "next/image"
import { CircleUserRoundIcon } from "lucide-react"
import { formatPrice } from "@/lib/format-price"
import { TotalOrders } from "@/lib/infer-type"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export default function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Sales</CardTitle>
        <CardDescription>History of recent sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders.map(({ order, product, productVariant, id, productID, orderID, quantity }) => (
              <TableRow key={id}>
                <TableCell>
                  {order.user.image && order.user.name ? (
                    <div className="flex items-center gap-2">
                      <Image src={order.user.image} alt={order.user.name} width={36} height={36} className="rounded-full" />
                      <p>{order.user.name}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CircleUserRoundIcon className="w-6 h-6" strokeWidth={1.5} />
                      <p className="text-xs">{order.user.name ? order.user.name : "User not found"}</p>
                    </div>
                  )}
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell className="text-center">{quantity}</TableCell>
                <TableCell className="flex justify-end">
                  <Image className="w-16 h-16 rounded-md" src={productVariant.variantImages[0].url} alt={product.title} width={320} height={320} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}