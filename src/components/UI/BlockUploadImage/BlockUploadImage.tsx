import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';
import cn from 'classnames/bind';

import InputFileIcon from '../InputFile/InputFileIcon';
import { convertBytesTo } from '@/libs/utils/handler-data';
import ButtonClose from '../ButtonClose/ButtonClose';
import styles from './BlockUploadImage.module.css';
import IconInfo from '@/components/Icons/IconInfo';

const cx = cn.bind(styles);

type Props = {
  title: string;
  isLoading?: boolean;
  poster: File | null;
  setPoster: Dispatch<SetStateAction<File | null>>;
  resetData?: boolean; // Триггер сброса изображения.
  posterUrl: string | null; // Существует только при редактировании новости.
  setPosterUrl: Dispatch<SetStateAction<string | null>>;
  isSquare?: boolean; // true если квадратное изображение
  validationText?: string; // Текст если есть ошибка валидации, иначе ''
  tooltip?: { text: string; id: string };
};
const noImage = '/images/icons/noimage.svg';

/**
 * Блок для загрузки Титульного изображения для новости
 * Устанавливает в setPoster данные типа File, показывает загруженное изображения для контроля
 */
export default function BlockUploadImage({
  title,
  poster,
  setPoster,
  isLoading,
  resetData,
  posterUrl,
  setPosterUrl,
  isSquare,
  validationText,
  tooltip,
}: Props) {
  const [imageTitle, setImageTitle] = useState<string>(noImage);

  // Сброс отображаемого изображения после отправки формы.
  useEffect(() => {
    setImageTitle(noImage);
  }, [resetData]);

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
        setPosterUrl(null);
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
      <div className={styles.box__title}>
        <h2 className={styles.title}>
          <div className={styles.box__info}>
            {title}
            {tooltip && <IconInfo squareSize={20} tooltip={tooltip} />}
          </div>
        </h2>
        <span className={styles.validate}>{validationText}</span>
      </div>

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

      <div className={cx('relative', { square: isSquare })}>
        {/* в данном случае компонент Image не нужен */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={posterUrl || imageTitle} alt="title image" className={styles.img} />

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
