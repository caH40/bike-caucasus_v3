'use client';

import { SessionProvider } from 'next-auth/react';

/**
 *Обертка для предоставления контекста сеанса для приложения.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
