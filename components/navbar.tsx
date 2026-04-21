"use client"
import { usePathname } from 'next/navigation'
import Logo from '@/components/logo/logo'

export const Navbar = () => {
  let pathname = usePathname()

  return (
    <>
      {pathname === "/" ? null : (
        <nav>
          <a href="/">
            <Logo className="fixed top-8 left-5 h-6 w-auto fill-zinc-800 z-[999] xl:h-7" />
          </a>
        </nav>
      )}
    </>
  )
}