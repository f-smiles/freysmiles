'use client'

// NOTE signIn ACTION IS NOT FROM auth.ts
// want to execute the action with the CLIENT version
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"

export const OAuthProviders = ({ mode }: { mode: "login" | "signup" | undefined }) => {
  return (
    <Button
      onClick={() => signIn("google", { redirect: false, callbackUrl: "/" })}
      variant="outline"
      className="flex items-center w-full gap-2 mt-4"
    >
      <FcGoogle className="w-6 h-6" />
      {mode ==="login" ? "Sign in with Google" : "Sign up with Google"}
    </Button>
  )
}