import { type SubmitHandler, useForm } from 'react-hook-form';

import BoxButtonAuth from '../../BoxButtonAuth/BoxButtonAuth';
import BoxInputAuth from '../../BoxInputAuth/BoxInputAuth';
import { validatePassword } from '@/libs/utils/validatorService';
import { type IRegistrationForm } from '@/types/index.interface';
import styles from '../FormAuth.module.css';

type Props = {
  validationAll: string;
  onSubmit: SubmitHandler<IRegistrationForm>;
};

/**
 * Форма для создания новго пароля
 */
export default function FormNewPassword({ onSubmit, validationAll }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegistrationForm>({ mode: 'all' });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Создание нового пароля</h2>
      <BoxInputAuth
        id="new-password"
        autoComplete="new-password"
        type="password"
        register={validatePassword(register)}
        label="Введите новый пароль:"
        validationText={errors.password ? errors.password.message : ''}
      />
      <BoxButtonAuth link="registration" validationText={validationAll}>
        Сохранить
      </BoxButtonAuth>
    </form>
  );
}
