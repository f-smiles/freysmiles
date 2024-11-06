import { NewPasswordForm } from "./new-password-form"

export default function NewPassword() {
  return (
    <section className="flex items-center justify-center w-full h-full min-h-screen px-4 sm:px-6 lg:px-8 dark:bg-primary">
      <div className="w-full max-w-xl mx-auto">
        <NewPasswordForm />
      </div>
    </section>
  )
}
