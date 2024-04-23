import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'your username' },
        age: { label: 'age', type: 'text', placeholder: 'your age' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password', placeholder: 'your password' },
      },
      async authorize(credentials, req) {
        // проверка на заполнение всех обязательных данных
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = {
          id: '0',
          name: credentials.username,
          email: credentials.email,
          age: credentials.age,
          password: credentials.password,
        };

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/login', // Путь к вашей пользовательской странице входа
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },

    async signIn({ user, account, profile, email, credentials }) {
      // обработка ввода данных в формS авторизации?
      console.log((user.name?.length ?? 0) < 4);

      if (!user || (user.name?.length ?? 0) < 4) {
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = 'user';
      }

      return session;
    },
  },
};
