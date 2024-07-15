'use client';

import cn from 'classnames';

import { TPermission } from '@/types/models.interface';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import styles from '../Form.module.css';
import { useLoadingStore } from '@/store/loading';
import BoxInput from '../../BoxInput/BoxInput';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import { postPermission } from '@/actions/permissions';
import Button from '../../Button/Button';
import { toast } from 'sonner';

type Props = {};

/**
 * Форма создания Разрешений (доступов) к ресурсам сайта.
 */
export default function FormPermissions({}: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

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

    const res = await postPermission(dataForm);

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
        defaultValue={name}
        loading={isLoading}
        register={register('name', {
          required: 'Обязательное поле',
          minLength: {
            value: 3,
            message: 'Название Разрешения должно быть больше 2х символов',
          },
          maxLength: {
            value: 30,
            message: 'Название события не может быть больше 30 символов',
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
        defaultValue={description}
        loading={isLoading}
        register={register('description', {
          required: 'Обязательное поле',
          minLength: {
            value: 10,
            message: 'Название Разрешения должно быть больше 10 символов',
          },
          maxLength: {
            value: 100,
            message: 'Название события не может быть больше 100 символов',
          },
        })}
        validationText={errors.description ? errors.description.message : ''}
      />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name="Добавить" theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
