import cn from 'classnames';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import Header from '../components/Header/Header';
import Providers from '../components/Providers';
import { roboto, montserrat_Alternates } from '../libs/fonts';
import Footer from '@/components/Footer/Footer';
import ModalLoading from '@/components/ModalLoading/ModalLoading';
import MobileMenu from '@/components/UI/MobileMenu/MobileMenu';
import { metadataHomePage } from '@/meta/meta';
import './globals.css';
import Script from 'next/script';
import { Suspense } from 'react';
import YandexMetrika from '@/components/YandexMetrika/YandexMetrika';

export const metadata: Metadata = metadataHomePage;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={cn(roboto.className, montserrat_Alternates.variable, 'body')}>
        {/* <!-- Yandex.Metrika counter --> */}

        <Script id="metrika-counter" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
 
              ym(88492388, "init", {
                    defer: true,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:false
              });`}
        </Script>

        <Script
          id="yandex-ads-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.yaContextCb = window.yaContextCb || [];
          window.yaContextCb.push(() => {
            Ya.Context.AdvManager.render({
              "blockId": "R-A-5213436-4",
              "type": "floorAd",
              "platform": "desktop"
            });
            Ya.Context.AdvManager.render({
              "blockId": "R-A-5213436-3",
              "type": "floorAd",
              "platform": "touch"
            });
          });`,
          }}
        />
        <Script
          id="yandex-ads-script"
          src="https://yandex.ru/ads/system/context.js"
          strategy="afterInteractive"
          async
        />

        <Suspense fallback={<></>}>
          <YandexMetrika />
        </Suspense>

        {/* <!-- /Yandex.Metrika counter --> */}
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
