'use server'

import { Resend } from "resend"
import getBaseUrl from "@/lib/base-url"

const resend = new Resend(process.env.RESEND_API_KEY)
const domain = getBaseUrl()

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Frey Smiles Orthodontics - Confirmation email",
    html: `<p>Click to <a href='${confirmLink}'>confirm your email</a></p>`,
  })

  if (error) return error
  if (data) return data
}

export const sendTwoFactorTokenByEmail = async (email: string, token: string) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Frey Smiles Orthodontics - Your Two Factor Code",
    html: `<p>Your confirmation code: ${token}</p>`,
  })

  if (error) return error
  if (data) return data
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/reset-password?token=${token}`

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Frey Smiles Orthodontics - Password Reset",
    html: `<p>Click to <a href='${resetLink}'>reset your password</a></p>`,
  })

  if (error) return error
  if (data) return data
}