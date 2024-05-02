import { type SubmitHandler, useForm } from 'react-hook-form';

import BoxButtonAuth from '../../BoxButtonAuth/BoxButtonAuth';
import BoxInputAuth from '../../BoxInputAuth/BoxInputAuth';
import { validateEmail } from '@/libs/utils/validatorService';
import { type IRegistrationForm } from '@/types/index.interface';
import styles from '../FormAuth.module.css';

type Props = {
  validationAll: string;
  onSubmit: SubmitHandler<IRegistrationForm>;
};

/**
 * Форма для регистрации нового пользователя
 */
export default function FormResetPassword({ onSubmit, validationAll }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegistrationForm>({ mode: 'all' });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Сброс пароля</h2>
      <BoxInputAuth
        id="email"
        autoComplete="email"
        type="text"
        register={validateEmail(register)}
        label="Email"
        validationText={errors.email ? errors.email.message : ''}
      />
      <BoxButtonAuth
        help="Впервые на сайте?"
        linkLabel="Создать аккаунт!"
        link="registration"
        validationText={validationAll}
      >
        Сбросить пароль
      </BoxButtonAuth>
    </form>
  );
}
