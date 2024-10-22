'use server'

import { actionClient } from "@/lib/safe-action"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "../db"
import { products } from "../schema"

export const deleteProduct = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const product = await db.delete(products).where(eq(products.id, id)).returning()
      revalidatePath("/dashboard/products")
      return { success: `Successfully deleteProduct product - ${product[0].title}` }
    } catch (error) {
      return { error: "Failed to delete product. Please try again." }
    }
  })