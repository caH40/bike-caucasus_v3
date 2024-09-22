import { type SubmitHandler, useForm } from 'react-hook-form';

import BoxButtonAuth from '../../BoxButtonAuth/BoxButtonAuth';
import BoxInputAuth from '../../BoxInputAuth/BoxInputAuth';
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from '@/libs/utils/validatorService';
import styles from '../FormAuth.module.css';
import { type IRegistrationForm } from '@/types/index.interface';

type Props = {
  validationAll: string;
  onSubmit: SubmitHandler<IRegistrationForm>;
};

/**
 * Форма для регистрации нового пользователя
 */
export default function FormRegistration({ onSubmit, validationAll }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegistrationForm>({ mode: 'all' });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Регистрация аккаунта</h2>
      <BoxInputAuth
        id="username"
        autoComplete="username"
        type="text"
        register={validateUsername(register)}
        label="Логин"
        validationText={errors.username ? errors.username.message : ''}
      />
      <BoxInputAuth
        id="email"
        autoComplete="email"
        type="text"
        register={validateEmail(register)}
        label="Email"
        validationText={errors.email ? errors.email.message : ''}
      />
      <BoxInputAuth
        id="password"
        autoComplete="current-password"
        type="password"
        register={validatePassword(register)}
        label="Пароль"
        linkLabel="Забыли пароль?"
        link="reset-password"
        validationText={errors.password ? errors.password.message : ''}
      />
      <BoxButtonAuth
        help="Уже есть аккаунт?"
        linkLabel="Вход!"
        link="login"
        validationText={validationAll}
      >
        Регистрация
      </BoxButtonAuth>
    </form>
  );
}
