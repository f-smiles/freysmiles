'use client'

import { AuthCard } from "@/components/auth/auth-card"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { newPassword } from "@/server/actions/new-password"
import { NewPasswordSchema } from "@/types/new-password-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const NewPasswordForm = () => {

  const token = useSearchParams().get('token')

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [showNewPassword, setShowNewPassword] = useState(false)

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  })

  const { execute, status } = useAction(newPassword, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error)
      if (data?.success) setSuccess(data.success)
    },
    onError(error) {
      console.error(error)
    },
  })

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    execute({ password: values.password, token })
  }

  return (
    <AuthCard
      title="Enter your new password"
      description="Passwords must have a minimum length of 8 characters, and must contain at least one uppercase character, one number, and one special character"
      backButtonHref="/auth/login"
      backButtonLabel="Return to login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="• • • • • • • •"
                      type={showNewPassword ? "text" : "password"}
                      disabled={status === "executing"}
                      autoComplete="current-password"
                      className="hide-password-toggle"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(prev => !prev)}
                      disabled={!field.value}
                    >
                      {showNewPassword ? (
                        <EyeIcon className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <EyeOffIcon className="w-4 h-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">{showNewPassword ? 'Hide password' : 'Show password'}</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            className={cn("w-full", status === "executing" ? "animate-pulse" : "")}
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </AuthCard>
  )
}