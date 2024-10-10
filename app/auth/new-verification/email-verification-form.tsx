'use client'

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { newVerification } from "@/server/actions/tokens"
import { AuthCard } from "@/components/auth/auth-card"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"


{/*
    VERIFY USER EMAIL
    - When user signs up via Credentials, an email is sent to their account to verify their email
    - When user clicks the verification link in the email, they are redirected to this page
    - Get the token from the URL, check the token, and verify the account
*/}
export const EmailVerificationForm = () => {

  const token = useSearchParams().get('token')
  const router = useRouter()

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleVerification = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError("No token found")
      return
    }

    newVerification(token).then((data) => {
      if (data.error) setError(data.error)

      if (data.success) {
        setSuccess(data.success)
        router.push("/auth/login")
      }
    })
  }, [])

  useEffect(() => {
    handleVerification()
  }, [])

  return (
    <section className="flex items-center justify-center w-full h-full min-h-screen px-4 sm:px-6 lg:px-8 dark:bg-primary">
      <div className="w-full max-w-xl mx-auto">
        <AuthCard
          title="Account Verification"
          backButtonHref="/auth/login"
          backButtonLabel="Return to login"
        >
          <div className="flex flex-col items-center w-full gap-4">
            {!error && !success ? (
              <span className="inline-flex items-center px-4 py-2 ">
                <svg className="w-5 h-5 mr-3 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Verifying Email...</p>
              </span>
            ) : null}

            <FormError message={error} />
            <FormSuccess message={success} />
          </div>
        </AuthCard>
      </div>
    </section>
  )
}
