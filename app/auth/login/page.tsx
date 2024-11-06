import { LoginForm } from "@/app/auth/login/login-form";

export default function Login() {
  return (
    <section className="flex items-center justify-center w-full h-full min-h-screen px-4 sm:px-6 lg:px-8 dark:bg-primary">
      <div className="w-full max-w-xl mx-auto">
        <LoginForm />
      </div>
    </section>
  )
}
