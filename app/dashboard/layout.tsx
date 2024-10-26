import DashboardNav from '@/components/dashboard/dashboard-nav'
import { auth } from '@/server/auth'
import { ChartColumnIncreasing, Package, PackagePlus, Settings, ShoppingBag } from 'lucide-react'
import { redirect } from 'next/navigation'


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) redirect("/auth/login")

  const userLinks = [
    {
      label: 'Orders',
      href: '/dashboard/orders',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="w-5 h-5" />
    },
  ] as const

  const adminLinks = session?.user?.role === "admin" ? [
    {
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: <ChartColumnIncreasing className="w-5 h-5" />
    },
    {
      label: 'Add Product',
      href: '/dashboard/add-product',
      icon: <PackagePlus className="w-5 h-5" />
    },
    {
      label: 'Products',
      href: '/dashboard/products',
      icon: <Package className="w-5 h-5" />
    },
  ] as const : []

  const allLinks = [...adminLinks, ...userLinks]

  if (session) return (
    <div className="flex items-start justify-center w-full h-full min-h-screen px-4 sm:px-6 lg:px-8 dark:bg-primary lg:py-48">
      <div className="w-full max-w-3xl mx-auto space-y-12">
        <DashboardNav allLinks={allLinks} />

        <section>
          {children}
        </section>
      </div>
    </div>
  )
}
