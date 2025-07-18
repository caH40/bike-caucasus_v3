import { TSessionUser } from './index.interface';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  /* eslint-disable */
  interface Session {
    user: TSessionUser;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    rolePermissions: string[];
    id: string; // порядковый числовой id, присваиваемый при регистрации
    provider: string; // название провайдера с помощью которого произошла аутентификация
    idDB: string; // id базы данных mongodb
  }
}
