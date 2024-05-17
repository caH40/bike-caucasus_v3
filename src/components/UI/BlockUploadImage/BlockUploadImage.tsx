import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';

import InputFile from '../InputFile/InputFile';
import { convertBytesTo } from '@/libs/utils/handler-data';
import ButtonClose from '../ButtonClose/ButtonClose';
import styles from './BlockUploadImage.module.css';

type Props = {
  isLoading?: boolean;
  fileImageTitle: File | null;
  setFileImageTitle: Dispatch<SetStateAction<File | null>>;
};
const noImage = '/images/icons/noimage.svg';

/**
 * Блок для загрузки Титульного изображения для новости
 * Устанавливает в setFileImageTitle данные типа File, показывает загруженное изображения для контроля
 */
export default function BlockUploadImage({
  fileImageTitle,
  setFileImageTitle,
  isLoading,
}: Props) {
  const [imageTitle, setImageTitle] = useState<string>(noImage);

  // обработка загрузки изображения
  const getPictures = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      return;
    }

    // проверка на максимальный разрешенный размер загружаемого файла
    const maxSizeFileInMBytes = 7;
    const sizeFileInMBytes = convertBytesTo(file.size, 'mB');
    if (sizeFileInMBytes > maxSizeFileInMBytes) {
      return toast.error(`Размер файла не должен превышать ${maxSizeFileInMBytes} МБайт`);
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      if (e.target && typeof e.target.result === 'string') {
        const dataUrl = e.target.result;

        // установка Data URL (base64) для отображения загруженного изображения
        setImageTitle(dataUrl);

        // установка изображения File в fileImageTitle для дальнейшей работы с ним
        setFileImageTitle(file);
      }
    };
    reader.readAsDataURL(file);
  };

  // удаление загруженного изображения
  const deleteImage = () => {
    setImageTitle(noImage);
    setFileImageTitle(null);
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Титульное изображение:*</h2>
      <div className={styles.block__image}>
        <div className={styles.relative}>
          {/* в данном случае компонент Image не нужен */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageTitle} alt="title image" className={styles.img} />
          {fileImageTitle && (
            <>
              <ButtonClose getClick={deleteImage} />
              <div className={styles.top} />
            </>
          )}
        </div>

        <InputFile
          name="uploadImage"
          label="Загрузить"
          accept=".jpg, .jpeg, .png, .webp"
          getChange={getPictures}
          loading={isLoading}
          disabled={imageTitle !== noImage}
        />
      </div>
    </section>
  );
}
