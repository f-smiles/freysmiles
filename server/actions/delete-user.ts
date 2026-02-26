'use server'

import { actionClient } from "@/lib/safe-action"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { db } from "../db"
import { users } from "../schema"
import { signOut } from "../auth"

export const deleteUser = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const user = await db.delete(users).where(eq(users.id, id)).returning()
      return { success: `Successfully deleted user - ${user[0].email}` }
    } catch (error) {
      return { error: "Failed to delete user. Please try again." }
    }
  })