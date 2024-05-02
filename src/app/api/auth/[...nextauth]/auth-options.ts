import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

import { User } from '../../../../database/mongodb/Models/User';
import { IUser } from '../../../../types/models.interface';
import { connectToMongo } from '../../../../database/mongodb/mongoose';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'your username' },
        password: { label: 'Password', type: 'password', placeholder: 'your password' },
      },

      async authorize(credentials) {
        // проверка на заполнение всех обязательных данных
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        const { username, password } = credentials;

        await connectToMongo();
        const userDB: IUser | null = await User.findOne({
          username: username.toLowerCase(),
        }).lean();

        const isCorrectedPass = userDB && (await bcrypt.compare(password, userDB.password));

        if (!isCorrectedPass) {
          return null;
        }

        return {
          id: String(userDB._id),
          name: userDB.username,
          email: userDB.email,
          role: userDB.role,
          image: userDB.photoProfile,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/login', // Путь к вашей пользовательской странице входа
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // console.log('Обработчик callback jwt', user);

        // добавление в токен данных user
        token = { ...token, ...user };
      }
      return token;
    },

    // async signIn({ user, account, profile, email, credentials }) {
    //   // console.log({ user, account, profile, email, credentials });

    //   // обработка ввода данных в формS авторизации?
    //   // console.log('Обработчик callback signIn', user);

    //   return true;
    // },
    async session({ session, token }) {
      if (session.user) {
        // console.log('Обработчик callback session', token);

        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.picture;
      }

      return session;
    },
  },
};
