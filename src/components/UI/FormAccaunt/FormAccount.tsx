'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import Wrapper from '../../Wrapper/Wrapper';
import BoxInput from '../BoxInput/BoxInput';
import Button from '../Button/Button';
import { useLoadingStore } from '@/store/loading';
import { handlerResponse } from '@/libs/utils/response';
import type { ServerResponse, TFormAccount } from '@/types/index.interface';
import type { TUserDto } from '@/types/dto.types';
import styles from './FormAccount.module.css';
import CheckboxRounded from '../CheckboxRounded/CheckboxRounded';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

type Props = {
  profile: TUserDto; // данные профиля из БД
  putAccount: (dataForm: TFormAccount) => Promise<ServerResponse<any>>; // eslint-disable-line
};

/**
 * Форма для обновления данных аккаунта.
 * @param param0
 * @returns
 */
export default function FormAccount({ profile, putAccount }: Props) {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TFormAccount>({
    mode: 'all',
    defaultValues: profile,
  });

  const onSubmit: SubmitHandler<TFormAccount> = async (dataForm) => {
    setLoading(true);
    dataForm.id = profile.id;
    const responseFromServer = await putAccount(dataForm);

    handlerResponse(responseFromServer);
    setLoading(false);
  };

  return (
    <Wrapper title="Данные аккаунта">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* поле ввода информации об аккаунте в Телеграм */}
        <BoxInput
          label="Аккаунт в Телеграм:"
          id="telegram"
          autoComplete="offered"
          type="text"
          // defaultValue={profile.social.telegram ?? ''}
          loading={isLoading}
          register={register('social.telegram', {
            pattern: {
              value: /^https:\/\/(?:t\.me|telegram\.me)\//,
              message: 'Ссылка должна начинаться с https://t.me',
            },
          })}
          validationText={errors.social?.telegram ? errors.social?.telegram.message : ''}
        />

        {/* поле ввода информации об аккаунте в vk.com */}
        <BoxInput
          label="Аккаунт в ВКонтакте:"
          id="vk"
          autoComplete="offered"
          type="text"
          // defaultValue={profile.social.vk ?? ''}
          loading={isLoading}
          register={register('social.vk', {
            pattern: {
              value: /^https:\/\/(?:vk\.com)\//,
              message: 'Ссылка должна начинаться с https://vk.com/',
            },
          })}
          validationText={errors.social?.vk ? errors.social?.vk.message : ''}
        />

        {/* поле ввода информации об аккаунте в strava.com */}
        <BoxInput
          label="Аккаунт в Strava:"
          id="strava"
          autoComplete="offered"
          type="text"
          // defaultValue={profile.social.strava ?? ''}
          loading={isLoading}
          register={register('social.strava', {
            pattern: {
              value: /^https:\/\/www\.strava\.com\/athletes\//,
              message: 'Ссылка должна начинаться с https://www.strava.com/athletes/',
            },
          })}
          validationText={errors.social?.strava ? errors.social?.strava.message : ''}
        />

        {/* поле ввода информации об ID на сайте bike-caucasus */}
        <BoxInput
          label="Bike-Caucasus id:"
          id="id"
          name="id"
          autoComplete="offered"
          type="string"
          disabled={true}
          defaultValue={String(profile.id) ?? 'не найден, обратитесь в поддержку!'}
        />

        {/* поле ввода информации об роли пользователя */}
        <BoxInput
          label="Статус на сайте:"
          id="role"
          name="role"
          autoComplete="offered"
          type="string"
          disabled={true}
          defaultValue={profile.role?.name ?? 'не найден, обратитесь в поддержку!'}
        />

        {/* поле ввода информации об email */}
        <BoxInput
          label="E-mail:"
          id="email"
          name="email"
          autoComplete="email"
          type="email"
          disabled={true}
          defaultValue={profile.email ?? 'не найден, обратитесь в поддержку!'}
        />

        <TitleAndLine hSize={2} title="Настройки" />

        <Controller
          name="preferences.showPatronymic"
          control={control}
          render={({ field }) => {
            return (
              <CheckboxRounded
                id="showPatronymic"
                label="Отображать отчество"
                value={field.value ?? false}
                setValue={field.onChange}
                functional={false}
              />
            );
          }}
        />
        <div className={styles.box__button}>
          <Button name="Сохранить" theme="green" loading={isLoading} />
        </div>
      </form>
    </Wrapper>
  );
}
