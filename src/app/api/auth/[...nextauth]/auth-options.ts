import { type AuthOptions } from 'next-auth';
import { type ObjectId } from 'mongoose';
import CredentialsProvider from 'next-auth/providers/credentials';
import Yandex from 'next-auth/providers/yandex';
import bcrypt from 'bcrypt';
// import Google from 'next-auth/providers/google';
import VK from 'next-auth/providers/vk';

import { User } from '@/Models/User';
import { IUserModel, TRoleModel } from '@/types/models.interface';
import { getNextSequenceValue } from '@/services/sequence';
import { getProviderProfileDto } from '@/libs/dto/provider';
import { Role } from '@/database/mongodb/Models/Role';
import { errorLogger } from '@/errors/error';

export const authOptions: AuthOptions = {
  providers: [
    Yandex({
      id: 'yandex',
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    }),
    // Google({
    //   id: 'google',
    //   clientId: process.env.GOOGLE_ID!,
    //   clientSecret: process.env.GOOGLE_SECRET!,
    // }),
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

        const userDB = await User.findOne({
          'credentials.username': username.toLowerCase(),
        }).lean<IUserModel>();

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
    error: '/auth/login/access-denied?error=', // Путь к вашей пользовательской странице входа
  },

  callbacks: {
    async jwt({ token, user, account }) {
      const userDB = await User.findOne({ email: token.email }, { role: true })
        .populate('role')
        .lean<{ role: Omit<TRoleModel, '_id'> }>();

      // добавление в токен данных user
      if (account && account.provider === 'vk') {
        token.provider = account.provider;
        token.email = account.email as string;
      } else if (user) {
        token.email = user.email;
      }

      token.rolePermissions = userDB?.role?.permissions || [];
      return token;
    },

    async signIn({ user, account, profile }) {
      try {
        // eslint-disable-next-line no-console
        console.log({ user, account, profile });

        if (!account || account.provider === 'credentials') {
          return true;
        }

        const provider = account.provider.toLowerCase();
        let email = user.email ?? (account.email as string | undefined);

        // если email отсутствует — генерируем заглушку
        const hasRealEmail = !!email;
        email = email ?? `no-email-${provider}-${user.id}@noemail.local`;

        // Поиск пользователя по provider.id и provider.name
        const userWithIdAndProviderDB = await User.findOne({
          'provider.id': user.id,
          'provider.name': provider,
        });

        if (!userWithIdAndProviderDB) {
          const profileCur = getProviderProfileDto(profile, provider);
          const id = await getNextSequenceValue('user');

          const roleUser: { _id: ObjectId } | null = await Role.findOne(
            { name: 'user' },
            { _id: true }
          );

          if (!roleUser) {
            throw new Error('Не найдена роль пользователя user для регистрации пользователя.');
          }

          // Предотвращение дубликатов по email (если email "реальный")
          if (hasRealEmail) {
            const emailExists = await User.findOne({ email: email.toLowerCase() });
            if (emailExists) {
              throw new Error(
                'email из провайдера уже используется другим пользователем. Возможно, вы входили через другой сервис.'
              );
            }
          }

          const userNew = {
            id,
            provider: {
              id: user.id,
              name: provider,
              image: user.image,
            },
            email: email.toLowerCase(),
            role: roleUser._id,
            emailConfirm: hasRealEmail,
            person: {
              firstName: profileCur.firstName,
              lastName: profileCur.lastName,
              gender: profileCur.gender,
            },
          };

          const userCreated = await User.create(userNew);

          if (!userCreated) {
            throw new Error('Ошибка при создании нового пользователя в БД.');
          }

          return true;
        }

        // Если email совпадает — вход разрешён
        if (userWithIdAndProviderDB.email === email.toLowerCase()) {
          return true;
        }

        // Проверка на дубликат email (если email реальный)
        if (hasRealEmail) {
          const userWithCurrentEmailDB = await User.findOne({ email: email.toLowerCase() });
          if (userWithCurrentEmailDB) {
            throw new Error(
              'email из провайдера уже используется другим пользователем. Возможно, вы входили через другой сервис.'
            );
          }

          // email у пользователя с этим provider.id изменился — обновляем
          userWithIdAndProviderDB.email = email.toLowerCase();
          userWithIdAndProviderDB.emailConfirm = true;
          await userWithIdAndProviderDB.save();
        }

        return true;
      } catch (error) {
        errorLogger(error); // eslint-disable-line
        if (error instanceof Error) {
          const encodedError = encodeURIComponent(error.message);
          return `/auth/login/access-denied?error=${encodedError}`;
        }
        return false;
      }
    },

    // async signIn({ user, account, profile }) {
    //   try {
    //     // если нет данных стороннего сервиса (account) или вход по логин/пароль, то выход из signIn()
    //     if (!account || account.provider === 'credentials') {
    //       return true;
    //     }

    //     const provider = account.provider;
    //     let email = user.email;
    //     if (provider === 'vk') {
    //       email = email ?? (account.email as string | undefined);
    //     }

    //     // email обязателен !!!!!! добавить в информационное сообщение
    //     if (!email) {
    //       throw new Error('Не получен email с provider!');
    //     }

    //     // поиск пользователя с id и provider в БД
    //     const userWithIdAndProviderDB = await User.findOne({
    //       'provider.id': user.id,
    //       'provider.name': provider,
    //     });

    //     // если не найден, то регистрация
    //     if (!userWithIdAndProviderDB) {
    //       const profileCur = getProviderProfileDto(profile, provider);

    //       // Получение порядкового id профиля нового пользователя.
    //       const id = await getNextSequenceValue('user');

    //       // Получение _id Роли пользователя с правами User.
    //       const roleUser: { _id: ObjectId } | null = await Role.findOne(
    //         { name: 'user' },
    //         { _id: true }
    //       );

    //       if (!roleUser) {
    //         throw new Error('Не найдена роль пользователя user для регистрации пользователя.');
    //       }

    //       const userNew = {
    //         id,
    //         provider: {
    //           id: user.id,
    //           name: provider.toLocaleLowerCase(),
    //           image: user.image,
    //         },
    //         email: email.toLocaleLowerCase(),
    //         role: roleUser._id,
    //         emailConfirm: true,
    //         person: {
    //           firstName: profileCur.firstName,
    //           lastName: profileCur.lastName,
    //           gender: profileCur.gender,
    //         },
    //       };

    //       const emailExists = await User.findOne({ email });

    //       if (emailExists) {
    //         throw new Error(
    //           'email из провайдера уже есть у другого пользователя. Вы могли входить на сайт через другого провайдера (соцсеть), где указан такой же email как у текущего.'
    //         );
    //       }

    //       const userCreated = await User.create(userNew);

    //       if (!userCreated) {
    //         throw new Error('Ошибка при создании нового пользователя в БД.');
    //       }

    //       return true;
    //     }

    //     // email из provider соответствует email User с БД
    //     if (userWithIdAndProviderDB.email === email) {
    //       return true;
    //     }

    //     // проверка наличия email из provider у другого пользователя с БД
    //     const userWithCurrentEmailDB = await User.findOne({ email: email });

    //     // ошибка, email из провайдера уже у другого пользователя !!!!!!!!!!
    //     if (userWithCurrentEmailDB) {
    //       throw new Error(
    //         'email из провайдера уже есть у другого пользователя. Вы могли входить на сайт через другого провайдера (соцсеть), где указан такой же email как у текущего.'
    //       );
    //     }

    //     // значит пользователь выполняющий аутентификацию изменил свой email у провайдера
    //     // обновляем email в БД
    //     userWithIdAndProviderDB.email = email;
    //     await userWithIdAndProviderDB.save();

    //     return true;
    //   } catch (error) {
    //     errorLogger(error); // eslint-disable-line
    //     if (error instanceof Error) {
    //       const encodedError = encodeURIComponent(error.message);
    //       return `/auth/login/access-denied?error=${encodedError}`;
    //     }
    //     return false;
    //   }
    // },
    async session({ session, token }) {
      if (session.user) {
        const userDB = await User.findOne(
          { email: token.email },
          {
            id: true,
            role: true,
            image: true,
            'provider.image': true,
            imageFromProvider: true,
          }
        )
          .populate({ path: 'role', select: ['name', 'description', 'permissions'] })
          .lean<{
            id: number;
            role: Omit<TRoleModel, '_id'>;
            _id: ObjectId;
            image?: string;
            imageFromProvider: boolean;
            provider: { image: string };
          }>();

        // при отсутствии пользователя в БД выходить из сессии
        if (!userDB) {
          return session;
        }

        const image = userDB.imageFromProvider ? userDB.provider?.image : userDB.image;

        session.user.id = String(userDB.id);
        session.user.idDB = String(userDB._id);
        session.user.role = userDB.role;
        session.user.image = image;
        session.user.provider = token.provider;
      }

      return session;
    },
  },
};
