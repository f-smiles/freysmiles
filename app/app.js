'use client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './_store/config'
import Navbar from './_components/Navbar'
import Footer from './_components/Footer'

export default function App({ children }) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navbar />
          {children}
          <Footer />
        </PersistGate>
      </Provider>
    </>
  )
}
