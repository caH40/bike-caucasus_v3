import type { Metadata } from 'next';

import './globals.css';
import { roboto, montserrat_Alternates } from '../libs/fonts';

export const metadata: Metadata = {
  metadataBase: new URL(`https://bike-caucasus.ru`),
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
      <body className={`${roboto.className} ${montserrat_Alternates.className}`}>
        {children}
      </body>
    </html>
  );
}
