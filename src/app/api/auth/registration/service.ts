import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../../../../database/mongodb/Models/User';
import { connectToMongo } from '../../../../database/mongodb/mongoose';
import { mailService } from '@/services/mail/nodemailer';
import { UserConfirm } from '@/database/mongodb/Models/User-confirm';

type Params = {
  username: string;
  email: string;
  password: string;
  role: string;
};

export async function postRegistrationService({
  username,
  email,
  password,
  role,
}: Params): Promise<void> {
  await connectToMongo();

  // проверка существует ли уже пользователь с таким email или username.
  const candidate = await User.findOne({
    // email, username сохраняется в нижний регистр.
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });

  if (candidate) {
    throw new Error('Ошибка при регистрации. Такой username или email уже зарегистрирован.');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(password, salt);

  // создание нового пользователя
  const { _id: id } = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: passwordHashed,
    role,
  });

  // создание записи контроля активации профиля и подтверждения email
  const activationToken = uuidv4();
  await UserConfirm.create({
    userId: String(id),
    date: Date.now(),
    activationToken,
    email: email.toLowerCase(),
  });

  // отправка письма для контроля активации профиля и подтверждения email
  const target = 'registration'; //для отправки письма для активации
  await mailService(target, activationToken, email, username, password);
}
