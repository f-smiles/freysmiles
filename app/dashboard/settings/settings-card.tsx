'use client'

import { useState } from "react"
import type { Session } from "next-auth"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useAction } from "next-safe-action/hooks"

import { SettingsSchema } from "@/types/settings-schema"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { settings } from "@/server/actions/settings"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { UploadButton } from "@/app/api/uploadthing/uploadthing"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export const SettingsCard = ({ session }: { session: Session }) => {

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [imageUploading, setImageUploading] = useState(false)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: session.user.name || undefined,
      email: session.user.email || undefined,
      password: undefined,
      newPassword: undefined,
      image: session.user.image || undefined,
      twoFactorEnabled: session.user.twoFactorEnabled || undefined,
    },
  })

  const { execute, status } = useAction(settings, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error)
      if (data?.success) setSuccess(data.success)
    },
    onError(error) {
      setError("Something went wrong. Please try again.")
    }
  })

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    execute(values)
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>

                  {!form.getValues("image") && (
                    <span className="flex items-center justify-center rounded-full w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-primary text-primary-foreground">
                      <p className="text-xl font-bold md:text-2xl lg:text-4xl">{session.user.name?.charAt(0).toUpperCase()}</p>
                    </span>
                  )}
                  {form.getValues("image") && (
                    <figure>
                      <Image
                        src={form.getValues("image")!}
                        alt={`${form.getValues("name")}'s profile image`}
                        width={112}
                        height={112}
                        className="rounded-full w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36"
                      />
                    </figure>
                  )}
                  <UploadButton
                    className="upload-button-custom w-max"
                    endpoint="imageUploader"
                    content={{button({ ready }) {
                      if (ready) return <p>Add photo...</p>
                      return <p>Uploading...</p>
                    }}}
                    onClientUploadComplete={(res) => {
                      form.setValue("image", res[0].url!)
                      setImageUploading(false)
                      return
                    }}
                    onUploadError={(error) => {
                      form.setError("image", {
                        type: "validate",
                        message: error.message,
                      })
                      setImageUploading(false)
                      return
                    }}
                  />

                  <FormControl>
                    <Input
                      placeholder="User profile picture"
                      disabled={status === "executing"}
                      type="hidden"
                      {...field}
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
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="• • • • • • • •"
                        disabled={status === "executing" || session.user.isOAuth}
                        className="hide-password-toggle"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(prev => !prev)}
                        disabled={!field.value}
                      >
                        {showCurrentPassword ? (
                          <EyeIcon className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <EyeOffIcon className="w-4 h-4" aria-hidden="true" />
                        )}
                        <span className="sr-only">{showCurrentPassword ? 'Hide password' : 'Show password'}</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="• • • • • • • •"
                        disabled={status === "executing" || session.user.isOAuth}
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

            <FormField
              control={form.control}
              name="twoFactorEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-4 p-4 border rounded-lg">
                  <span>
                    <FormLabel>Two-Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable two-factor authentication (2FA) for an added layer of security on your account.<br />
                      When activated, you will be required to verify your identity with a code during login.
                    </FormDescription>
                  </span>

                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={status === "executing" || session.user.isOAuth}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormError message={error} />
            <FormSuccess message={success} />

            <Button
              type="submit"
              disabled={status === "executing" || imageUploading}
            >
              {status === "executing" ? (
                <span className="inline-flex items-center">
                  <svg className="w-5 h-5 mr-3 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : "Save settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
