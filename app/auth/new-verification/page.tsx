import { EmailVerificationForm } from '@/app/auth/new-verification/email-verification-form'

export default function EmailVerification() {
  return (
    <section className="flex items-center justify-center w-full h-full min-h-screen px-4 sm:px-6 lg:px-8 dark:bg-primary">
      <div className="w-full max-w-xl mx-auto">
        <EmailVerificationForm />
      </div>
    </section>
  )
}
