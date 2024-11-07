'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { useAction } from "next-safe-action/hooks"

import { SignupSchema } from "@/types/signup-schema"
import { emailSignup } from "@/server/actions/email-signup"
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { cn } from "@/lib/utils"


export default function SignupForm() {

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  const { execute, status } = useAction(emailSignup, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error)
      if (data?.success) setSuccess(data.success)
    },
    onError(error) {
      console.error(error)
    }
  })

  const onSubmit = (values: z.infer<typeof SignupSchema>) => {
    // console.log(values)
    execute(values)
  }

  return (
    <AuthCard
      title="Create a new account"
      description="Sign up to manage your orders, preferences, and more"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account? Login now"
      showOAuthProviders
      mode="signup"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="John Doe"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="johndoe000@email.com"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="• • • • • • • •"
                      autoComplete="current-password"
                      className="hide-password-toggle"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(prev => !prev)}
                      disabled={!field.value}
                    >
                      {showPassword ? (
                        <EyeIcon className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <EyeOffIcon className="w-4 h-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">{showPassword  ? "Hide password" : "Show password"}</span>
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
            disabled={status === "executing"}
            className={cn("w-full", status === "executing" ? "animate-pulse" : "")}
          >
            Sign Up
          </Button>
        </form>
    </Form>
    </AuthCard>
  )
}
