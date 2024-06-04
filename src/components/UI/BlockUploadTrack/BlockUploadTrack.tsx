import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';

import InputFileIcon from '../InputFile/InputFileIcon';
import { convertBytesTo } from '@/libs/utils/handler-data';
import styles from './BlockUploadTrack.module.css';
import BoxInputSimple from '../BoxInput/BoxInputSimple';

type Props = {
  title?: string;
  isLoading?: boolean;
  setTrack: Dispatch<SetStateAction<File | null>>;
  resetData: boolean; // Триггер сброса изображения.
};

/**
 * Блок для загрузки Титульного изображения для новости
 * Устанавливает в setPoster данные типа File, показывает загруженное изображения для контроля
 */
export default function BlockUploadTrack({ title, setTrack, isLoading, resetData }: Props) {
  const [trackName, setTrackName] = useState<string>('');
  // Сброс отображаемого изображения после отправки формы.
  useEffect(() => {
    setTrack(null);
  }, [resetData, setTrack]);

  // обработка загрузки изображения
  const getFile = async (event: ChangeEvent<HTMLInputElement>) => {
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

    setTrack(file);
    setTrackName(file.name);
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <InputFileIcon
        name="uploadTrack"
        icon={{
          width: 26,
          height: 22,
          src: '/images/icons/gpx-upload.svg',
          alt: 'Upload track',
        }}
        accept=".gpx"
        getChange={getFile}
        loading={isLoading}
      />
      <BoxInputSimple
        value={trackName}
        disabled={true}
        id={'fileGPX'}
        name={'fileGPX'}
        autoComplete=""
        type="text"
        handlerInput={setTrackName}
        validationText={trackName.length > 0 ? '' : 'Загрузите файл'}
      />
    </section>
  );
}
