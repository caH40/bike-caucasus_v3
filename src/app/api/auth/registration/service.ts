import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../../../../database/mongodb/Models/User';
import { mailService } from '@/services/mail/nodemailer';
import { UserConfirm } from '@/database/mongodb/Models/User-confirm';
import { getNextSequenceValue } from '@/services/sequence';
import { ObjectId } from 'mongoose';
import { Role } from '@/database/mongodb/Models/Role';

type Params = {
  username: string;
  email: string;
  password: string;
};

export async function postRegistrationService({
  username,
  email,
  password,
}: Params): Promise<void> {
  // проверка существует ли уже пользователь с таким email или username.
  const candidate = await User.findOne({
    // email, username сохраняется в нижний регистр.
    $or: [{ email: email.toLowerCase() }, { 'credentials.username': username.toLowerCase() }],
  });

  if (candidate) {
    throw new Error('Ошибка при регистрации. Такой username или email уже зарегистрирован.');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(password, salt);

  // Получение порядкового id профиля нового пользователя.
  const id = await getNextSequenceValue('user');

  // Получение _id Роли пользователя с правами User.
  const roleUser: { _id: ObjectId } | null = await Role.findOne(
    { name: 'user' },
    { _id: true }
  );

  // создание нового пользователя
  const userDB = await User.create({
    id,
    credentials: {
      username: username.toLowerCase(),
      password: passwordHashed,
    },
    email: email.toLowerCase(),
    role: roleUser?._id,
    imageFromProvider: false,
  });

  if (!userDB) {
    throw new Error('Ошибка при сохранении данных Пользователя в БД');
  }

  // создание записи контроля активации профиля и подтверждения email
  const activationToken = uuidv4();
  await UserConfirm.create({
    userId: String(userDB._id),
    date: Date.now(),
    activationToken,
    email: email.toLowerCase(),
  });

  const auth = {
    token: activationToken,
    username: username.toLowerCase(),
    password,
  };

  // отправка письма для контроля активации профиля и подтверждения email
  const target = 'registration'; //для отправки письма для активации
  await mailService({ target, auth, email });

  // Отправка письма администратору сайта о регистрации нового пользователя.
  await mailService({
    email: 'support@bike-caucasus.ru',
    target: 'newUser',
    additional: {
      person: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
      },
      provider: 'credentials',
    },
  });
}
