import { ResetPasswordRequestForm } from "./reset-password-request-form";

export default function ResetPasswordRequest() {
  return (
    <div className="flex items-start justify-center w-full h-full min-h-screen px-4 sm:px-6 lg:px-8 dark:bg-primary lg:py-48">
      <div className="w-full max-w-lg mx-auto">
        <ResetPasswordRequestForm />
      </div>
    </div>
  )
}