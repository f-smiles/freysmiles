import './globals.css'
import "@/public/styles/uploadthing.css"
import "@/public/styles/index.css"
import { auth } from '@/server/auth'
import App from './app'


export const metadata = {
  title: {
    template: '%s | FreySmiles',
    default: 'FreySmiles Orthodontics',
  },
  description: "At FreySmiles Orthodontics, we treat a mix of adults and children with modern braces technology and Invisalign clear aligners, so you see results immediately. We serve 4 locations in the Lehigh Valley: Allentown, Bethlehem, Lehighton, and Schnecksville. Book Now - no referral needed.",
  keywords: ["family centric orthodontic care", "invisalign providers lehigh valley", "braces for kids", "braces for teens", "palatal expanders", "alternative to braces", "alternative to palatal expanders", "free orthodontic consultation", "top rated orthodontist", "board certified"],
}


export default async function RootLayout({ children }) {
  const session = await auth()

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <App user={session?.user}>
          {children}
        </App>
           <div id="modal-root"></div>
      </body>
    </html>
  )
}
