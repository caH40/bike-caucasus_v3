import { type SubmitHandler, useForm } from 'react-hook-form';

import BoxButtonAuth from '../../BoxButtonAuth/BoxButtonAuth';
import BoxInputAuth from '../../BoxInputAuth/BoxInputAuth';
import { validatePassword, validateUsername } from '@/libs/utils/validatorService';
import styles from './FormLogin.module.css';
import { type IRegistrationForm } from '@/types/index.interface';

type Props = {
  validationAll: string;
  onSubmit: SubmitHandler<IRegistrationForm>;
};

/**
 * Форма для регистрации нового пользователя
 */
export default function FormLogin({ onSubmit, validationAll }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegistrationForm>({ mode: 'all' });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Вход на Bike-Caucasus</h2>
      <BoxInputAuth
        id="username"
        autoComplete="username"
        type="text"
        register={validateUsername(register)}
        label="Логин"
        validationText={errors.username ? errors.username.message : ''}
      />
      <BoxInputAuth
        id="password"
        autoComplete="current-password"
        type="password"
        register={validatePassword(register)}
        label="Пароль"
        linkLabel="Забыли пароль?"
        link="password-reset"
        validationText={errors.password ? errors.password.message : ''}
      />
      <BoxButtonAuth
        help="Впервые на сайте?"
        linkLabel="Создать аккаунт!"
        link="registration"
        validationText={validationAll}
      >
        Вход
      </BoxButtonAuth>
    </form>
  );
}
