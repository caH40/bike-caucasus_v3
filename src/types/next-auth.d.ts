import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  /* eslint-disable */
  interface Session {
    user: {
      /** The user's postal address. */
      role: string;
      id: string; // порядковый числовой id, присваиваемый при регистрации
      provider: string; // название провайдера с помощью которого произошла аутентификация
      idDB: string; // id базы данных mongodb
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role: string;
    id: string; // порядковый числовой id, присваиваемый при регистрации
    provider: string; // название провайдера с помощью которого произошла аутентификация
    idDB: string; // id базы данных mongodb
  }
}
