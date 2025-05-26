'use client';

import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import cn from 'classnames';

import { useLoadingStore } from '@/store/loading';
import { TPermissionDto, TRoleDto } from '@/types/dto.types';
import styles from '../Form.module.css';
import Button from '../../Button/Button';
import BoxInput from '../../BoxInput/BoxInput';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import ContainerTablePermissionsForForm from '@/components/Table/Containers/Permissions/ContainerTablePermissionsForForm';
import { usePermissionTable } from '@/store/permission-table';
import { toast } from 'sonner';
import { ServerResponse, TFormRole } from '@/types/index.interface';
import { postRole } from '@/actions/permissions';
import { useRouter } from 'next/navigation';

type Params = {
  role?: TRoleDto;
  permissions: TPermissionDto[];
  // eslint-disable-next-line no-unused-vars
  putRole?: ({ roleEdited }: { roleEdited: TFormRole }) => Promise<ServerResponse<null>>;
};

/**
 * Форма создания Ролей для пользователей.
 */
export function FormRole({ role, permissions, putRole }: Params) {
  // Id разрешений, добавленных в форме редактирования Роли.
  const permissionsAdded = usePermissionTable((state) => state.permissions);
  const resetPermissions = usePermissionTable((state) => state.resetPermissions);
  const initPermission = usePermissionTable((state) => state.initPermission);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const router = useRouter();

  // Если существует role, значит осуществляется редактирование этой роли.
  // Установка массива разрешений в хранилище для последующего редактирования.
  useEffect(() => {
    if (!role) {
      return;
    }
    initPermission(role.permissions);
  }, [initPermission, role]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<TFormRole, '_id'>>({
    mode: 'all',
    defaultValues: {
      name: role ? role.name : '',
      description: role ? role.description : '',
    },
  });

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<Omit<TFormRole, '_id'>> = async (dataForm) => {
    if (!permissionsAdded.length) {
      return toast.error('Необходимо добавить минимум одно Разрешение для Роли ');
    }

    const roleFromForm = { ...dataForm, permissions: permissionsAdded };

    try {
      // Старт отображения спинера загрузки.
      setLoading(true);

      let response = {} as ServerResponse<null>;

      if (putRole && role) {
        response = await putRole({ roleEdited: { ...roleFromForm, _id: role._id } });
      } else {
        response = await postRole({ newRole: roleFromForm });
      }

      if (!response.ok) {
        throw new Error(response.message);
      }

      toast.success(response.message);
      resetPermissions();

      // Если редактирование Роли, то после сохранения данных переход на родительскую страницу.
      if (putRole && role) {
        router.push('/admin/access-management/roles/edit');
      } else {
        // После создании Роли очищать все поля формы.
        reset();
      }
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
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      {/* Блок ввода Названия */}
      <BoxInput
        label="Название:*"
        id="name"
        autoComplete="off"
        type="text"
        loading={isLoading}
        disabled={!!role} // При редактировании нельзя изменять название Роли.
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
            value: /^[a-z-]+$/,
            message: 'Разрешены прописные латинские буквы и символ тире',
          },
        })}
        validationText={errors.name ? errors.name.message : ''}
      />

      {/* Блок ввода описания */}
      <BoxTextarea
        label="Описание:*"
        id="description"
        autoComplete="off"
        type="text"
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

      <ContainerTablePermissionsForForm
        permissions={permissions}
        hiddenColumnHeaders={['Модерация разрешений', 'Выбор разрешений для добавления']}
      />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={role ? 'Обновить' : 'Создать'} theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
