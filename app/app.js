'use client'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './_store/config'
import Navbar from './_components/Navbar'
import Footer from './_components/Footer'
import { Toast } from '@/components/ui/toaster'

export default function App({ children, user }) {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <Navbar user={user} /> */}
        <main>
          <Toast />
          {children}
        </main>
        <Footer />
      </PersistGate>
    </Provider>
  )
}
