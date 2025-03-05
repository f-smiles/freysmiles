import DesktopNav from '@/components/nav/desktop-nav'
import MobileNav from '@/components/nav/mobile-nav'

export default function Navbar({ user }) {
  return (
    <>
      <DesktopNav user={user} />
      <MobileNav user={user} />
    </>
  )
}