import nodemailer from 'nodemailer';

import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { mailTemplates } from './mail-emplates';
import { TMailTarget } from '@/types/index.interface';

const { MAIL_USER, MAIL_PASS, MAIL_HOST, MAIL_PORT, MAIL_SECURE } = process.env;

/**
 * Сервис отправки email
 */
export async function mailService(
  target: TMailTarget,
  token: string,
  email: string,
  username: string,
  password?: string
) {
  if (!MAIL_USER || !MAIL_PASS || !MAIL_HOST || !MAIL_PORT || !MAIL_SECURE) {
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
  const date = new Date().toLocaleString();

  const template = mailTemplates[target];
  if (!template) {
    throw new Error(`Неизвестный тип письма: ${target}`);
  }

  const subject = template.subject;
  const html = template.getHtml({ username, email, token, password, date });

  await transporter.sendMail({
    from: MAIL_USER,
    to: email,
    subject,
    html,
  });
}
