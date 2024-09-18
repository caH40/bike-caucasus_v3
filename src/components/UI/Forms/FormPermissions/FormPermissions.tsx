'use client';

import { toast } from 'sonner';
import cn from 'classnames';
import { SubmitHandler, useForm } from 'react-hook-form';

import BoxInput from '../../BoxInput/BoxInput';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import Button from '../../Button/Button';
import { useLoadingStore } from '@/store/loading';
import { postPermission, putPermission } from '@/actions/permissions';
import type { TPermissionDto } from '@/types/dto.types';
import type { TPermission } from '@/types/models.interface';
import styles from '../Form.module.css';

type Props = {
  permission?: TPermissionDto;
};

/**
 * Форма создания Разрешений (доступов) к ресурсам сайта.
 */
export default function FormPermissions({ permission }: Props) {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<TPermission, '_id'>>({ mode: 'all' });

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<Omit<TPermission, '_id'>> = async (dataForm) => {
    // Старт отображение спинера загрузки.
    setLoading(true);

    let res = {
      data: null,
      ok: false,
      message: 'Не передана ни функция обновления, ни создания новости!',
    };
    if (permission) {
      res = await putPermission({ _id: permission._id, ...dataForm });
    } else {
      res = await postPermission(dataForm);
    }

    // Завершение отображение спинера загрузки.
    setLoading(false);

    // Отображение статуса сохранения События в БД.
    if (res.ok) {
      reset();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      {/* Блок ввода Названия */}
      <BoxInput
        label="Название:*"
        id="name"
        autoComplete="off"
        type="text"
        defaultValue={permission?.name ? permission.name : ''}
        loading={isLoading}
        register={register('name', {
          required: 'Обязательное поле',
          minLength: {
            value: 3,
            message: 'Название Разрешения должно быть больше 2х символов',
          },
          maxLength: {
            value: 50,
            message: 'Название события не может быть больше 50 символов',
          },
          pattern: {
            value: /^[a-z.]+$/i,
            message: 'Разрешены прописные латинские буквы и символ точки',
          },
        })}
        validationText={errors.name ? errors.name.message : ''}
      />

      {/* Блок ввода Названия */}
      <BoxTextarea
        label="Описание:*"
        id="description"
        autoComplete="off"
        type="text"
        defaultValue={permission?.description ? permission.description : ''}
        loading={isLoading}
        register={register('description', {
          required: 'Обязательное поле',
          minLength: {
            value: 10,
            message: 'Название Разрешения должно быть больше 10 символов',
          },
          maxLength: {
            value: 400,
            message: 'Название события не может быть больше 400 символов',
          },
        })}
        validationText={errors.description ? errors.description.message : ''}
      />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={permission ? 'Обновить' : 'Добавить'} theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
