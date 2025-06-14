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
import { mailService } from '@/services/mail/nodemailer';

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
        // Проверка на заполнение всех обязательных данных.
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
    signIn: '/auth/login', // Путь к вашей пользовательской странице входа.
    error: '/auth/login/access-denied?error=', // Путь к вашей пользовательской странице входа.
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

    /**
     * Обработчик входа через credentials.
     * Обработчик входа/регистрации через провайдеры аутентификации.
     */
    async signIn({ user, account, profile }) {
      try {
        // Если account существует, или вход осуществляется через credentials то вход, иначе процедура регистрации через включенные способы аутентификации.
        if (!account || account.provider === 'credentials') {
          // Проверка логина/пароля прошла раньше, после чего запущена функция signIn.
          return true;
        }

        // Провайдера аутентификации.
        const provider = account.provider.toLowerCase();

        // Определение email в зависимости от провайдера.
        let email = user.email ?? (account.email as string | undefined);

        // если email отсутствует — генерируем заглушку.
        const hasRealEmail = !!email;
        email = email ?? `no-email-${provider}-${user.id}@noemail.local`;

        // Поиск пользователя по provider.id и provider.name БД.
        const userWithIdAndProviderDB = await User.findOne({
          'provider.id': user.id,
          'provider.name': provider,
        });

        // Если нет учетной записи в БД, то регистрация новой учетной записи (аккаунта) с данными из провайдера.
        if (!userWithIdAndProviderDB) {
          const profileCur = getProviderProfileDto(profile, provider);

          // Создание порядкового id пользователя на сайте.
          const id = await getNextSequenceValue('user');

          // По умолчанию присваивается роль User.
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

          const person = {
            firstName: profileCur.firstName,
            lastName: profileCur.lastName,
            gender: profileCur.gender,
          };

          // Данные для создания (регистрации) новой учетной записи (аккаунта) пользователя.
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
            person,
          };

          const userCreated = await User.create(userNew);

          // Отправка сообщения о регистрации нового пользователя.

          if (!userCreated) {
            throw new Error('Ошибка при создании нового пользователя в БД.');
          }

          // Отправка письма администратору о новой регистрации.
          await mailService({
            email: 'support@bike-caucasus.ru',
            target: 'newUser',
            additional: { person, provider },
          });

          return true;
        }

        // Если email совпадает — вход разрешён.
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
