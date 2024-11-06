'use client'

import Link from "next/link"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAction } from "next-safe-action/hooks"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { LoginSchema } from "@/types/login-schema"
import { AuthCard } from "@/components/auth/auth-card"
import { emailLogin } from "@/server/actions/email-login"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"


export const LoginForm = () => {

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [showTwoFactor, setShowTwoFactor] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const formButtonRef = useRef<HTMLButtonElement>(null)

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  })

  const { execute, status } = useAction(emailLogin, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error)
      if (data?.success) setSuccess(data.success)

      if (data?.twoFactor) setShowTwoFactor(true)
    },
    onError(error) {
      console.error(error)
    }
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    execute(values)
  }

  return (
    <AuthCard
      title="Welcome back!"
      description="Login to your account"
      backButtonHref="/auth/signup"
      backButtonLabel="Don't have an account? Sign up now"
      showOAuthProviders
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {!showTwoFactor && (
            <div className="flex flex-col space-y-4">
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

              <span>
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

                <Button variant="link" asChild className="p-0 w-max">
                  <Link href="/auth/reset">Forgot your password?</Link>
                </Button>
              </span>
            </div>
          )}

          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center gap-4">
                  <FormLabel>A two-factor code was sent your email. Please input the code below.</FormLabel>
                  <FormControl>
                  <InputOTP
                    maxLength={6}
                    disabled={status === 'executing'}
                    autoFocus
                    onComplete={() => formButtonRef.current?.focus()}
                    {...field}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            ref={formButtonRef}
            type="submit"
            className={cn("w-full", status === "executing" ? "animate-pulse" : "")}
          >
            {showTwoFactor ? "Verify" : "Login"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  )
}
