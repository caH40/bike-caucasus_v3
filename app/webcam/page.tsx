'use client';

import { useSession } from 'next-auth/react';

export default function WebcamPage() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div>
      <h1>WebcamPage</h1>

      <span>Data Session: </span>
      <pre>{session && JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
