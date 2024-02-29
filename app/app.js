'use client'
import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './_store/config'
// gsap
import { gsap } from 'gsap-trial'
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger'
import { ScrollSmoother } from 'gsap-trial/ScrollSmoother'

import useIsomorphicLayoutEffect from '@/_helpers/isomorphicEffect'
import Navbar from './_components/Navbar'
import Footer from './_components/Footer'

export default function App({ children }) {
  
  const smoother = useRef()
  const ctx = useRef()
  const pathname = usePathname()

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

    ctx.current = gsap.context(() => {
      smoother.current = ScrollSmoother.create({
        smooth: 2,
        effects: true,
        smoothTouch: true
      })
    })

    return () => ctx.current.revert()
  }, [pathname])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navbar />
        <main>
          <div 
          // id="smooth-wrapper"
          >
            <div 
            // id="smooth-content"
            >
              {children}
              <Footer />
            </div>
          </div>
        </main>
      </PersistGate>
    </Provider>
  )
}
