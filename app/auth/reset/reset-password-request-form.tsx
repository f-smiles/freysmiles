'use client'

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { requestResetPassword } from "@/server/actions/reset-password-request"
import { RequestResetPasswordSchema } from "@/types/reset-request-schema"
import { AuthCard } from "@/components/auth/auth-card"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"


export const ResetPasswordRequestForm = () => {

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const form = useForm<z.infer<typeof RequestResetPasswordSchema>>({
    resolver: zodResolver(RequestResetPasswordSchema),
    defaultValues: {
      email: "",
    }
  })

  const { execute, status } = useAction(requestResetPassword, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error)
      if (data?.success) setSuccess(data.success)
		},
  })

  const onSubmit = (values: z.infer<typeof RequestResetPasswordSchema>) => {
    execute(values)
  }


  return (
    <AuthCard
      title="Forgot your password?"
      description="We will send you an email with a link to reset your password"
      backButtonHref="/auth/login"
      backButtonLabel="Return to login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pt-4 space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johnsmith@email.com"
                      type="email"
                      disabled={status === "executing"}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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