import nodemailer from 'nodemailer';

import { htmlRegistration } from './letters/registration';
import { htmlResetPassword } from './letters/resetpassword';
import { htmlRefreshPassword } from './letters/refreshpassword';

import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const { MAIL_USER, MAIL_PASS, MAIL_HOST, MAIL_PORT, MAIL_SECURE, NEXT_PUBLIC_SERVER_FRONT } =
  process.env;

/**
 * Сервис отправки email
 */
export async function mailService(
  target: string,
  token: string,
  email: string,
  username: string,
  password: string
) {
  if (
    !MAIL_USER ||
    !MAIL_PASS ||
    !MAIL_HOST ||
    !MAIL_PORT ||
    !MAIL_SECURE ||
    !NEXT_PUBLIC_SERVER_FRONT
  ) {
    throw new Error('Получены не все данные с env');
  }

  const smtpConfig: SMTPTransport.Options = {
    host: MAIL_HOST,
    port: +MAIL_PORT,
    secure: MAIL_SECURE === 'true' ? true : false,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  let subject;
  let html;
  const date = new Date().toLocaleString();

  if (target === 'registration') {
    subject = 'Подтверждение регистрации на сайте bike-caucasus.ru';
    html = htmlRegistration(username, password, email, token, NEXT_PUBLIC_SERVER_FRONT, date);
  }
  if (target === 'resetPassword') {
    subject = 'Сброс пароля на сайте bike-caucasus.ru';
    html = htmlResetPassword(username, email, token, NEXT_PUBLIC_SERVER_FRONT, date);
  }
  if (target === 'savedNewPassword') {
    subject = 'Обновление пароля профиля на сайте bike-caucasus.ru';
    html = htmlRefreshPassword(date, username, password);
  }

  const from = 'bikecaucasus@mail.ru';
  const to = email;

  const result = await transporter.sendMail({ from, to, subject, html });

  // !!!!!!!!!!! логирование консолей
  console.log('Message sent: %s', result.messageId); // eslint-disable-line
  if (!result.response.includes('250 OK')) {
    console.log('ошибка при отправки письма для активации аккаунта'); // eslint-disable-line
  }
}
