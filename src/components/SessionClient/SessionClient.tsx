'use client';

import { useSession } from 'next-auth/react';

/**
 * Компонент получение данных сессии на клиентской стороне
 */

export default function SessionClient() {
  const { data: session, status } = useSession();
  return (
    <div>
      {session && (
        <>
          <pre>{JSON.stringify(session, null, 2)}</pre>
          <pre>{JSON.stringify(status, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
