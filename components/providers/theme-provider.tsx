// 'use client'
// import * as React from 'react'
// import { ThemeProvider } from 'next-themes'

// export default function NextThemeProvider({ children }: { children: React.ReactNode }) {
//   const [mounted, setMounted] = React.useState(false)

//   React.useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) {
//     return null
//   }

//   return (
//     <ThemeProvider
//       attribute="class"
//       enableSystem={true}
//       defaultTheme="system"
//     >
//       {children}
//     </ThemeProvider>
//   )
// }

'use client'
import * as React from 'react'
// import { ThemeProvider } from 'next-themes' 

export default function NextThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
