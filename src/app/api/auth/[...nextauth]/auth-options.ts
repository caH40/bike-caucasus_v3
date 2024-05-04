import { type AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Yandex from 'next-auth/providers/yandex';
import bcrypt from 'bcrypt';
import Google from 'next-auth/providers/google';
import VK from 'next-auth/providers/vk';

import { User } from '../../../../database/mongodb/Models/User';
import { IUser } from '../../../../types/models.interface';
import { connectToMongo } from '../../../../database/mongodb/mongoose';

export const authOptions: AuthOptions = {
  providers: [
    Yandex({
      id: 'yandex',
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    }),
    Google({
      id: 'google',
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    VK({
      id: 'vk',
      clientId: process.env.VK_CLIENT_ID!,
      clientSecret: process.env.VK_CLIENT_SECRET!,
    }),
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
          provider: 'credentials',
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/login', // Путь к вашей пользовательской странице входа
    error: '/auth/login/access-denied', // Путь к вашей пользовательской странице входа
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // добавление в токен данных user
        if (account) {
          token.provider = account?.provider;
        }
        token = { ...token, ...user };
      }

      return token;
    },

    async signIn({ user, account }) {
      try {
        // если нет данных стороннего сервиса (account) или вход по логин/пароль, то выход из signIn()
        if (!account || account?.provider === 'credentials') {
          return true;
        }

        // подключение к БД
        await connectToMongo();

        // провайдер с через которого осуществляется аутентификация
        // два положительных случая:
        // 1. Провайдер уже привязан к аккаунту
        // 2. email провайдера совпадает с email зарегистрированного пользователя по логин/паролю
        const provider = account.provider;

        // поиск пользователя с id пользователя с Провайдера в БД
        // если пользователь с таким провайдером есть, то обновление картинки профиля и выход
        const dynamicKey = `${provider}.providerAccountId`;
        const userWithProviderDB = await User.findOne({ [dynamicKey]: user.id });
        if (userWithProviderDB) {
          userWithProviderDB[provider].image = user.image;
          await userWithProviderDB.save();
          return true;
        }

        // если пользователя с таким провайдером нет, то поиск пользователя,
        // зарегистрированного по логин/пароль с таким же email
        const userDB = await User.findOne({ email: user.email });
        if (userDB) {
          userDB[provider] = {
            providerAccountId: user.id,
            image: user.image,
          };
          await userDB.save();
          return true;
        }

        // сначала необходимо зарегистрироваться по логин/пароль
        return false;
      } catch (error) {
        console.log(error); // eslint-disable-line
        return true;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.picture;
        session.user.provider = token.provider;
      }

      return session;
    },
  },
};
