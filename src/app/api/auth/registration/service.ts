import bcrypt from 'bcrypt';

import { User } from '../../../../database/mongodb/Models/User';
import { connectToMongo } from '../../../../database/mongodb/mongoose';

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
    throw new Error('Ошибка при регистрации');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(password, salt);

  await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: passwordHashed,
    role,
  });
}
