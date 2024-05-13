import cn from 'classnames';

import Header from '../components/Header/Header';
import Providers from '../components/Providers';
import { roboto, montserrat_Alternates } from '../libs/fonts';
import './globals.css';

// types
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import Footer from '@/components/Footer/Footer';
import Modal from '@/components/UI/Modal/Modal';
import ModalLoading from '@/components/ModalLoading/ModalLoading';

export const metadata: Metadata = {
  metadataBase: new URL('https://bike-caucasus.ru'),
  title: 'Bike-caucasus',
  description: 'Главная страница сайта Bike-caucasus',
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(roboto.className, montserrat_Alternates.variable, 'body')}>
        <Providers>
          <div className="container">
            <Header />
            <main className="main">
              <ModalLoading />
              {children}
            </main>
            <Footer />
          </div>

          <Toaster
            expand={true}
            richColors={true}
            toastOptions={{ className: 'toast-success' }}
          />
          <Modal />
        </Providers>
      </body>
    </html>
  );
}
