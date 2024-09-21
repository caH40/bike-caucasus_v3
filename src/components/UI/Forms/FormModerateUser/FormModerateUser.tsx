'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import cn from 'classnames';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import Button from '../../Button/Button';
import SelectCustom from '../../SelectCustom/SelectCustom';
import { useLoadingStore } from '@/store/loading';
import { createOptionsRoles } from './utils';
import { TFormModerateUser } from '@/types/index.interface';
import { TRoleDto, TUserDto, TUserDtoPublic } from '@/types/dto.types';
import BoxInput from '../../BoxInput/BoxInput';
import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import { genderOptions } from '@/constants/other';
import styles from './FormModerateUser.module.css';
import { putUserModeratedData } from '@/actions/user';

type Params = {
  profile: TUserDto | TUserDtoPublic;
  roles: TRoleDto[];
};

/**
 * Форма модерации пользователей.
 */
export function FormModerateUser({ profile, roles }: Params) {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormModerateUser>({
    mode: 'all',
    defaultValues: {
      _id: profile._id,
      id: String(profile.id),
      firstName: profile.person.firstName,
      lastName: profile.person.lastName,
      patronymic: profile.person.patronymic,
      roleId: profile.role._id,
      city: profile.city,
    },
  });

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<Omit<TFormModerateUser, '_id'>> = async (dataForm) => {
    try {
      // Старт отображения спинера загрузки.
      setLoading(true);

      const user = {
        id: +dataForm.id,
        roleId: dataForm.roleId,
        person: {
          ...(dataForm.firstName && { firstName: dataForm.firstName }),
          ...(dataForm.lastName && { lastName: dataForm.lastName }),
          ...(dataForm.patronymic && { patronymic: dataForm.patronymic }),
          ...(dataForm.gender && { gender: dataForm.gender }),
        },
        ...(dataForm.city && { city: dataForm.city }),
      };

      const response = await putUserModeratedData({ user });

      if (!response.ok) {
        throw new Error(response.message);
      }

      toast.success(response.message);

      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(JSON.stringify(error));
      }
    } finally {
      // Завершение отображения спинера загрузки.
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.wrapper)}>
      <div className={styles.wrapper__inputs}>
        {/* Блок ввода Названия */}
        <div className={styles.wrapper__hor}>
          <BoxInput
            label={'ID в БД:'}
            id="_id-FormModerateUser"
            autoComplete="off"
            type="text"
            disabled={true}
            register={register('_id')}
            validationText={errors.lastName?.message}
            hasError={!!errors.lastName?.message}
            hideCheckmark={true}
          />

          <BoxInput
            label={'ID на сайте:'}
            id="id-FormModerateUser"
            autoComplete="off"
            type="text"
            disabled={true}
            register={register('id')}
            hideCheckmark={true}
          />
        </div>
        <div className={styles.wrapper__hor}>
          <BoxInput
            label={'Фамилия:*'}
            id="lastName-FormModerateUser"
            autoComplete="off"
            type="text"
            register={register('lastName', {
              minLength: { value: 2, message: '> 1' },
              maxLength: { value: 25, message: '< 25' },
            })}
            validationText={errors.lastName?.message}
            hasError={!!errors.lastName?.message}
            hideCheckmark={true}
          />

          <BoxInput
            label={'Имя:*'}
            id="firstName-FormModerateUser"
            autoComplete="off"
            type="text"
            register={register('firstName', {
              minLength: { value: 2, message: '> 1' },
              maxLength: { value: 20, message: '< 20' },
            })}
            validationText={errors.firstName?.message}
            hasError={!!errors.firstName?.message}
            hideCheckmark={true}
          />

          <BoxInput
            label={'Отчество:'}
            id="patronymic-FormModerateUser"
            autoComplete="off"
            type="text"
            register={register('patronymic', {})}
            hideCheckmark={true}
          />
        </div>

        <div className={styles.wrapper__hor}>
          <BoxSelectNew
            label="Пол:*"
            id="gender-BlockInputsRegisteredRider"
            // loading={loading}
            options={genderOptions}
            register={register('gender')}
            validationText={errors.gender?.message}
            hideCheckmark={true}
          />
        </div>
        <div className={styles.wrapper__hor}>
          <BoxInput
            label="Город:*"
            id="city-BlockInputsRegisteredRider"
            autoComplete="offered"
            type="text"
            // loading={loading}
            register={register('city', {
              minLength: { value: 2, message: '> 1' },
              maxLength: { value: 30, message: '< 30' },
            })}
            validationText={errors.city?.message}
            hasError={!!errors.city?.message}
            hideCheckmark={true}
          />
        </div>

        {/* Блок выбора роли для Пользователя */}
        <div className={styles.full__width}>
          <Controller
            name="roleId"
            control={control}
            render={({ field }) => (
              <SelectCustom
                state={field.value}
                setState={field.onChange}
                options={createOptionsRoles(roles)}
                label="Выберите Роль для пользователя на сайте:*"
                defaultValue={profile.role.name}
                validationText={errors.roleId?.message || ''}
              />
            )}
          />
        </div>

        {/* Кнопка отправки формы. */}
        <div className={styles.box__button}>
          <Button name={'Сохранить'} theme="green" loading={isLoading} />
        </div>
      </div>
    </form>
  );
}
