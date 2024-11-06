'use client'

import SignupForm from './signup-form'


export default function Signup() {
  return (
    <section className="flex items-center justify-center w-full h-full min-h-screen px-4 sm:px-6 lg:px-8 dark:bg-primary">
      <div className="w-full max-w-xl mx-auto">
        <SignupForm />
      </div>
    </section>
  )
}
