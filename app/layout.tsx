import Header from '../components/Header/Header';
import { roboto, montserrat_Alternates } from '../libs/fonts';
import cn from 'classnames';

import './globals.css';

// types
import type { Metadata } from 'next';
import Providers from '../components/Providers';

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
      <body className={cn(roboto.className, montserrat_Alternates.className, 'body')}>
        <Providers>
          <div className="container">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
