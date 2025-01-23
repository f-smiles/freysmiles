'use client'

import Image from "next/image"
import Link from "next/link"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import { ColumnDef, Row } from "@tanstack/react-table"
import { formatPrice } from "@/lib/format-price"
import { VariantsWithImagesTags } from "@/lib/infer-type"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MoreHorizontalIcon, PlusCircleIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "@/server/actions/delete-product"
import { ProductVariant } from "./product-variant"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumns = {
  id: number
  title: string
  price: number
  image: string
  variants: VariantsWithImagesTags[],
}

export const ActionCell = ({ row }: { row: Row<ProductColumns> }) => {
  const product = row.original

  const { execute, status } = useAction(deleteProduct, {
    onSuccess({ data }) {
      if (data?.error) toast.error(data.error)
      if (data?.success) toast.success(data.success)
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-8 h-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem className="focus:bg-[hsl(208,_100%,_97%)] focus:border focus:border-[hsl(221,_91%,_91%)] focus:text-[hsl(210,_92%,_45%)] dark:focus:bg-[hsl(215,_100%,_16%)] dark:focus:border dark:focus:border-[hsl(223,_100%,_32%)] dark:focus:text-[hsl(216,_87%,_85%)]">
          <Link href={`/dashboard/edit-product?id=${product.id}`}>
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="focus:bg-[hsl(359,_100%,_97%)] focus:border focus:border-[hsl(359,_100%,_94%)] focus:text-[hsl(360,_100%,_45%)] dark:focus:bg-[hsl(358,_76%,_10%)] dark:focus:border dark:focus:border-[hsl(357,_89%,_16%)] dark:focus:text-[hsl(358,_100%,_81%)]"
          onClick={() => execute({ id: product.id })}
        >
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<ProductColumns>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      return <p className="text-sm font-medium">{formatPrice(price)}</p>
    },
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue("variants") as VariantsWithImagesTags[]

      return (
        <div className="flex items-center gap-1">
          {variants && variants.map((variant) => (
            <TooltipProvider key={variant.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <ProductVariant
                      editMode={true}
                      productID={variant.productID}
                      variant={variant}
                    >
                      <div
                        key={variant.id}
                        className="w-4 h-4 rounded-full"
                        style={{ background: variant.color }}
                      />
                    </ProductVariant>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{variant.variantName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <ProductVariant editMode={false} productID={row.original.id}>
                    <PlusCircleIcon className="w-5 h-5" />
                  </ProductVariant>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <picture className="w-full overflow-hidden rounded-lg aspect-h-1 aspect-w-1">
          <Image
            src={row.getValue("image") as string}
            alt={row.getValue("title") as string}
            width={18}
            height={32}
            className="object-cover object-center w-full h-full"
          />
        </picture>
      )
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ActionCell,
  },
]