import Link from "next/link"

export const SignInButton = () => {
  return (
    <button className={`
      relative z-0 px-3 py-1.5 flex items-center gap-2 overflow-hidden whitespace-nowrap
      border-[1px] border-primary rounded-full
      font-medium text-primary
      transition-all duration-300
      before:transition-transform before:duration-1000
      before:absolute before:inset-0 before:-z-10 before:translate-y-[200%] before:scale-[2.5] before:rounded-[100%]
      before:bg-neutral-900 before:content-[""]
      hover:scale-105 hover:border-neutral-50 hover:text-neutral-50 hover:before:translate-y-[0%]
      active:scale-100`}
    >
      <Link href="/auth/login">
        Login
      </Link>
    </button>
  )
}