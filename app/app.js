'use client'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './_store/config'
import Navbar from './_components/Navbar'
import Footer from './_components/Footer'
import { Toast } from '@/components/ui/toaster'

export default function App({ children }) {
  useEffect( () => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navbar />
        <main>
          <Toast />
          {children}
        </main>
      </PersistGate>
      <Footer />
    </Provider>
  )
}
