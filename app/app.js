'use client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './_store/config';
// import Navbar from './_components/Navbar';
import MainNav from '../components/nav/MainNav';
import Footer from './_components/Footer';
import { Toast } from '@/components/ui/toaster';

export default function App({ children, user }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainNav user={user} />
        <main>
          <div>
            <Toast />
          </div>
          {children}
        </main>
        <Footer />
      </PersistGate>
    </Provider>
  );
}
