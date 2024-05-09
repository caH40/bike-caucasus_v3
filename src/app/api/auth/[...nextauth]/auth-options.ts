import { type AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Yandex from 'next-auth/providers/yandex';
import bcrypt from 'bcrypt';
import Google from 'next-auth/providers/google';
import VK from 'next-auth/providers/vk';

import { User } from '../../../../database/mongodb/Models/User';
import { IUserModel } from '../../../../types/models.interface';
import { connectToMongo } from '../../../../database/mongodb/mongoose';
import { getNextSequenceValue } from '@/services/sequence';
import { getProviderProfile } from '@/libs/dto/provider';
import { type ObjectId } from 'mongoose';
import { mkdir } from 'fs/promises';
import { myPath } from '@/libs/utils/path';

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
        const userDB: IUserModel | null = await User.findOne({
          'credentials.username': username.toLowerCase(),
        }).lean();

        if (!userDB || !userDB.credentials) {
          return null;
        }

        const isCorrectedPass = await bcrypt.compare(password, userDB.credentials.password);

        if (!isCorrectedPass) {
          return null;
        }

        return {
          id: String(userDB._id), // !!!!!!!!! добавлять нормальный id
          name: userDB.credentials.username,
          email: userDB.email,
          role: userDB.role,
          image: userDB.image,
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
      // добавление в токен данных user
      if (account && account.provider === 'vk') {
        token.provider = account.provider;
        token.email = account.email as string;
      } else if (user) {
        token.email = user.email;
      }

      return token;
    },

    async signIn({ user, account, profile }) {
      try {
        // если нет данных стороннего сервиса (account) или вход по логин/пароль, то выход из signIn()
        if (!account || account.provider === 'credentials') {
          return true;
        }

        const provider = account.provider;
        let email = user.email;
        if (provider === 'vk') {
          email = email ?? (account.email as string | undefined);
        }

        // email обязателен !!!!!! добавить в информационное сообщение
        if (!email) {
          return false;
        }

        // подключение к БД
        await connectToMongo();

        // поиск пользователя с id и provider в БД
        const userWithIdAndProviderDB = await User.findOne({
          'provider.id': user.id,
          'provider.name': provider,
        });

        // если не найден, то регистрация
        if (!userWithIdAndProviderDB) {
          const profileCur = getProviderProfile(profile, provider);

          const id = await getNextSequenceValue('user');

          // создание папки пользователя для файлов загрузки
          const pathProfile = myPath.getProfileUploads(id);
          await mkdir(pathProfile);

          const userNew = {
            id,
            provider: {
              id: user.id,
              name: provider.toLocaleLowerCase(),
            },
            email: email.toLocaleLowerCase(),
            image: user.image,
            role: 'user',
            emailConfirm: true,
            person: {
              firstName: profileCur.firstName,
              lastName: profileCur.lastName,
              gender: profileCur.gender,
            },
          };

          const userCreated = await User.create(userNew);

          if (userCreated) {
            return true;
          }

          return false;
        }

        // email из provider соответствует email User с БД
        if (userWithIdAndProviderDB.email === email) {
          return true;
        }

        // проверка наличия email из provider у другого пользователя с БД
        const userWithCurrentEmailDB = await User.findOne({ email: email });

        // ошибка, email из провайдера уже у другого пользователя !!!!!!!!!!
        if (userWithCurrentEmailDB) {
          return false;
        }

        // значит пользователь выполняющий аутентификацию изменил свой email у провайдера
        // обновляем email в БД
        userWithIdAndProviderDB.email = email;
        await userWithIdAndProviderDB.save();

        return true;
      } catch (error) {
        console.log(error); // eslint-disable-line
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        await connectToMongo();
        const userDB: { id: number; role: string; _id: ObjectId } | null = await User.findOne(
          { email: token.email },
          { id: true, role: true }
        ).lean();

        // при отсутствии пользователя в БД выходить из сессии
        if (!userDB) {
          return session;
        }

        session.user.id = String(userDB.id);
        session.user.idDB = String(userDB._id);
        session.user.role = userDB.role;
        session.user.image = token.picture;
        session.user.provider = token.provider;
      }

      return session;
    },
  },
};
