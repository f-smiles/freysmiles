"use client"
import Logo from './logo'
import { usePathname } from 'next/navigation'

export const Navbar = () => {
  let pathname = usePathname()

  return (
    <>
      {pathname === "/" ? null : (
        <nav>
          <a href="/">
            <Logo className="fixed top-12 left-5 h-6 w-auto fill-zinc-800 z-[999] xl:h-7" />
          </a>
        </nav>
      )}
    </>
  )
}