import Link from "next/link"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { formatDistance, subMinutes } from "date-fns"
import { MoreHorizontalIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { invoices } from "@/server/schema"
import { formatPrice } from "@/lib/format-price"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PaymentForm from "./payment-form"


export default async function DashboardOrders() {
  const user = await auth()

  if (!user) redirect("/auth/login")

  const userInvoiceHistory = await db.query.invoices.findMany({
    where: eq(invoices.userID, user.user.id),
    orderBy: (invoices, { desc }) => [desc(invoices.id)],
  })


  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice #</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date Placed</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userInvoiceHistory.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>
              <Badge
                className={cn(
                  "text-xs font-normal rounded-full",
                  invoice.status === "pending" ? "bg-muted text-primary hover:bg-muted" : null,
                  invoice.status === "awaiting payment" ? "bg-primary text-primary-foreground hover:bg-primary" : null,
                  invoice.status === "paid" ? "bg-success text-white hover:bg-success" : null,
                )}
              >
                {invoice.status ?? "pending"}
              </Badge>
            </TableCell>
            <TableCell>{formatDistance(subMinutes(invoice.created!, 0), new Date(), { addSuffix: true })}</TableCell>
            <TableCell>{formatPrice(invoice.total)}</TableCell>
            <TableCell>
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger className="float-right mx-4"><MoreHorizontalIcon className="w-4 h-4" /></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <DialogTrigger>{invoice.status === "paid" ? "View Invoice" : "Pay now"}</DialogTrigger>
                    </DropdownMenuItem>
                    {invoice.receiptURL ? (
                      <DropdownMenuItem>
                        <Link href={invoice.receiptURL} target={"_blank"}>Download Receipt</Link>
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent className="w-full max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Invoice #{invoice.id}</DialogTitle>
                    <DialogDescription>Date Created: {invoice.created?.toLocaleDateString()}</DialogDescription>
                  </DialogHeader>

                  <Card>
                    <CardContent>
                      {invoice.status === "awaiting payment" && (
                        <PaymentForm invoiceID={invoice.id} invoiceTotal={invoice.total} invoiceDescription={invoice.description} />
                      )}

                      {invoice.status === "paid" && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Description</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">{invoice.description}</TableCell>
                              <TableCell className="text-right">{formatPrice(invoice.total)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                  {invoice.status === "paid" && (
                    <DialogFooter className="flex items-center justify-between">
                      <p>Date Paid: {invoice.updated.toLocaleDateString()}</p>
                    </DialogFooter>
                  )}
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
