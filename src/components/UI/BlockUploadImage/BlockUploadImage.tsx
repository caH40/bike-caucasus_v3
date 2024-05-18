import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';

import InputFileIcon from '../InputFile/InputFileIcon';
import { convertBytesTo } from '@/libs/utils/handler-data';
import ButtonClose from '../ButtonClose/ButtonClose';
import styles from './BlockUploadImage.module.css';

type Props = {
  title: string;
  isLoading?: boolean;
  poster: File | null;
  setPoster: Dispatch<SetStateAction<File | null>>;
};
const noImage = '/images/icons/noimage.svg';

/**
 * Блок для загрузки Титульного изображения для новости
 * Устанавливает в setPoster данные типа File, показывает загруженное изображения для контроля
 */
export default function BlockUploadImage({ title, poster, setPoster, isLoading }: Props) {
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

        // установка изображения File в poster для дальнейшей работы с ним
        setPoster(file);
      }
    };
    reader.readAsDataURL(file);
  };

  // удаление загруженного изображения
  const deleteImage = () => {
    setImageTitle(noImage);
    setPoster(null);
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <InputFileIcon
        name="uploadImage"
        icon={{
          width: 26,
          height: 22,
          src: '/images/icons/image-upload.svg',
          alt: 'Upload image',
        }}
        accept=".jpg, .jpeg, .png, .webp"
        getChange={getPictures}
        loading={isLoading}
        disabled={imageTitle !== noImage}
      />

      <div className={styles.relative}>
        {/* в данном случае компонент Image не нужен */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageTitle} alt="title image" className={styles.img} />
        {poster && (
          <>
            <ButtonClose getClick={deleteImage} />
            <div className={styles.top} />
          </>
        )}
      </div>
    </section>
  );
}
