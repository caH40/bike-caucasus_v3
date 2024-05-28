import Image from 'next/image';
import { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';
import { toast } from 'sonner';

import Checkbox from '../Checkbox/Checkbox';
import InputFile from '../InputFile/InputFile';
import { blurDataURL } from '@/libs/image';
import type { TUserDto } from '@/types/dto.types';
import styles from './BlockUploadLogoProfile.module.css';

/**
 * Компонент для загрузки логотипа профиля.
 * @param setFile Функция для установки выбранного файла.
 * @param imageFromProvider Флаг, указывающий, является ли изображение загруженным провайдером.
 * @param setImageFromProvider Функция для установки значения флага imageFromProvider.
 * @param formData Данные профиля.
 */
type Props = {
  setFile: Dispatch<SetStateAction<File | null>>;
  imageFromProvider: boolean;
  setImageFromProvider: Dispatch<SetStateAction<boolean>>;
  formData: TUserDto;
  loading?: boolean;
};

export default function BlockUploadLogoProfile({
  setFile,
  imageFromProvider,
  setImageFromProvider,
  formData,
  loading,
}: Props) {
  const [urlFile, setUrlFile] = useState<string | undefined>(formData.image);

  /**
   * Обработчик выбора изображения из файла.
   * @param event Событие изменения ввода файла.
   */
  const getPictures = (event: ChangeEvent<HTMLInputElement>) => {
    setImageFromProvider(false);
    const fileFromForm = event.target.files?.[0] || null;
    if (!fileFromForm) {
      return;
    }

    if (!fileFromForm.type.startsWith('image/')) {
      return toast.error('Выбранный файл не является изображением');
    }

    // если уже был url картинки, то убираем, что бы поместить новый url
    if (urlFile) {
      URL.revokeObjectURL(urlFile);
    }

    // создание временного url картинки в памяти для отображения в Image
    const url = URL.createObjectURL(fileFromForm);
    setUrlFile(url);
    setFile(fileFromForm);
  };

  return (
    <section className={styles.wrapper}>
      <Image
        width={100}
        height={100}
        alt="Image profile"
        src={
          (imageFromProvider ? formData.provider?.image : urlFile) ??
          '/images/icons/noimage.svg'
        }
        className={styles.img}
        placeholder="blur"
        blurDataURL={blurDataURL}
      />

      <div className={styles.image__control}>
        <Checkbox
          value={imageFromProvider}
          setValue={setImageFromProvider}
          label={'Загруженная картинка'}
          id="imageFromProvider"
        />
        <InputFile
          name="uploadImage"
          label="Загрузить"
          accept=".jpg, .jpeg, .png, .webp"
          getChange={getPictures}
          loading={loading}
        />
      </div>
    </section>
  );
}
