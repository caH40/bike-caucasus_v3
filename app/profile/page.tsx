'use client';

import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  return (
    <div>
      <h1>ProfilePage</h1>
      <p>Data Session: </p>
      <p>Status: {status}</p>
      <pre>{session && JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}