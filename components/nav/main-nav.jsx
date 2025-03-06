import DesktopNav from '@/components/nav/desktop-nav'
import MobileNav from '@/components/nav/mobile-nav'
import ThemeButtons from '@/components/nav/theme-buttons'

export default function Navbar({ user }) {
  return (
    <div className="relative">
      <DesktopNav user={user} />
      <MobileNav user={user} />
      <ThemeButtons />
    </div>
  )
}