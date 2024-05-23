import cn from 'classnames';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import Header from '../components/Header/Header';
import Providers from '../components/Providers';
import { roboto, montserrat_Alternates } from '../libs/fonts';
import Footer from '@/components/Footer/Footer';
import ModalLoading from '@/components/ModalLoading/ModalLoading';
import MobileMenu from '@/components/UI/MobileMenu/MobileMenu';
import { metadataHomePage } from '@/constants/meta';
import './globals.css';

export const metadata: Metadata = metadataHomePage;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={cn(roboto.className, montserrat_Alternates.variable, 'body')}>
        <Providers>
          <div className="container">
            <Header />
            <main className="main">
              <MobileMenu />
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
        </Providers>
      </body>
    </html>
  );
}
