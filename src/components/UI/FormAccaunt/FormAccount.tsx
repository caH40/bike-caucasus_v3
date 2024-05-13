'use client';

import FormWrapper from '../Forms/FormWrapper/FormWrapper';
import type { MessageServiceDB } from '@/types/index.interface';
import styles from './FormAccount.module.css';
import { useForm } from 'react-hook-form';
import BoxInput from '../BoxInput/BoxInput';
import { useLoadingStore } from '@/store/loading';
import Button from '../Button/Button';

type Props = {
  formData: any;
  putAccount: () => Promise<MessageServiceDB<any>>;
};
type TFormAccount = {
  telegram?: string;
  vk?: string;
  youtube?: string;
  komoot?: string;
  strava?: string;
  whatsapp?: string;
  garminConnect?: string;

  phone?: string;
  role: string;
  email: string;
  id: number;
};

/**
 * Форма ввода данных аккаунта.
 * @param param0
 * @returns
 */
export default function FormAccount({ formData, putAccount }: Props) {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormAccount>({ mode: 'all' });

  const onSubmit = async () => {
    setLoading(true);
    putAccount();
    setLoading(false);
  };
  return (
    <FormWrapper title="Данные аккаунта">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* поле ввода информации об аккаунте в Телеграм */}
        <BoxInput
          label="Аккаунт в Телеграм:"
          id="telegram"
          autoComplete="offered"
          type="text"
          defaultValue={formData.telegram ?? ''}
          loading={isLoading}
          register={register('telegram', {
            pattern: {
              value: /^https:\/\/(?:t\.me|telegram\.me)\//,
              message: 'Ссылка должна начинаться с https://t.me',
            },
          })}
          validationText={errors.telegram ? errors.telegram.message : ''}
        />

        {/* поле ввода информации об аккаунте в vk.com */}
        <BoxInput
          label="Аккаунт в ВКонтакте:"
          id="vk"
          autoComplete="offered"
          type="text"
          defaultValue={formData.vk ?? ''}
          loading={isLoading}
          register={register('vk', {
            pattern: {
              value: /^https:\/\/(?:vk\.com)\//,
              message: 'Ссылка должна начинаться с https://vk.com/',
            },
          })}
          validationText={errors.vk ? errors.vk.message : ''}
        />

        {/* поле ввода информации об аккаунте в strava.com */}
        <BoxInput
          label="Аккаунт в Strava:"
          id="strava"
          autoComplete="offered"
          type="text"
          defaultValue={formData.strava ?? ''}
          loading={isLoading}
          register={register('strava', {
            pattern: {
              value: /^https:\/\/www\.strava\.com\/athletes\//,
              message: 'Ссылка должна начинаться с https://www.strava.com/athletes/',
            },
          })}
          validationText={errors.strava ? errors.strava.message : ''}
        />

        {/* поле ввода информации об ID на сайте bike-caucasus */}
        <BoxInput
          label="Bike-Caucasus id:"
          id="id"
          name="id"
          autoComplete="offered"
          type="string"
          disabled={true}
          defaultValue={formData.id ?? 'не найден, обратитесь в поддержку!'}
        />

        {/* поле ввода информации об роли пользователя */}
        <BoxInput
          label="Статус на сайте:"
          id="role"
          name="role"
          autoComplete="offered"
          type="string"
          disabled={true}
          defaultValue={formData.role ?? 'не найден, обратитесь в поддержку!'}
        />

        {/* поле ввода информации об email */}
        <BoxInput
          label="Статус на сайте:"
          id="email"
          name="email"
          autoComplete="email"
          type="email"
          disabled={true}
          defaultValue={formData.email ?? 'не найден, обратитесь в поддержку!'}
        />
        <div className={styles.box__button}>
          <Button name="Сохранить" theme="green" loading={isLoading} />
        </div>
      </form>
    </FormWrapper>
  );
}
