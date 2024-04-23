'use client';

import { useSession } from 'next-auth/react';

export default function WebcamPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>WebcamPage</h1>

      <span>Data Session: </span>
      <pre>{session && JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
