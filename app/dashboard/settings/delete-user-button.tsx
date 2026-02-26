import React from 'react'
import { useAction } from 'next-safe-action/hooks'
import { deleteUser } from '@/server/actions/delete-user'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { signOut } from 'next-auth/react'

export default function DeleteUserButton({ userId }: { userId: string }) {
  const { execute, status } = useAction(deleteUser, {
    onSuccess({ data }) {
      if (data?.error) toast.error(data.error)
      if (data?.success) {
        toast.success(data.success)
        signOut()
      }
    },
  })

  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={status === "executing"}
      onClick={() => execute({ id: userId })}
    >
      {status === "executing" ? "Deleting" : "Delete"}
    </Button>
  )
}