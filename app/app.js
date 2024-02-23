'use client'
// import { useRef } from 'react'
// import { usePathname } from 'next/navigation'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './_store/config'
// gsap
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap-trial/ScrollSmoother'
import { useGSAP } from '@gsap/react'

import Navbar from './_components/Navbar'
import Footer from './_components/Footer'
// import useIsomorphicLayoutEffect from '@/_helpers/useIsomorphicLayoutEffect'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP)
}

export default function App({ children }) {
  // const smoother = useRef()
  // const ctx = useRef()
  // const pathname = usePathname()

  // useIsomorphicLayoutEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
  //   ctx.current = gsap.context(() => {
  //     smoother.current = ScrollSmoother.create({
  //       smooth: 2,
  //       effects: true,
  //       smoothTouch: true
  //     })
  //   })

  //   return () => ctx.current.revert()
  // }, [pathname])

  // useGSAP(() => {
  //   ScrollSmoother.create({
  //     smooth: 2,
  //     effects: true,
  //   })
  // }, {
  //   dependencies: [pathname],
  //   revertOnUpdate: true,
  // })

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navbar />
          {/* <div id="smooth-wrapper">
            <div id="smooth-content"> */}
              {children}
            {/* </div>
          </div> */}
          <Footer />
        </PersistGate>
      </Provider>
    </>
  )
}
