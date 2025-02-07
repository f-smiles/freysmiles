'use client';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './_store/config';
// import Navbar from './_components/Navbar';
import MainNav from '@/components/nav/MainNav'
import Footer from './_components/Footer';
import { Toast } from '@/components/ui/toaster';

export default function App({ children, user }) {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainNav user={user} />
        <main id="smooth-wrapper">
          <div id="smooth-content">
            <Toast />
            {children}
            <Footer />
          </div>
        </main>
        <Footer />
      </PersistGate>
    </Provider>
  );
}
