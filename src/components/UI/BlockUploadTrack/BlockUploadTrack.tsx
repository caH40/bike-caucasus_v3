import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

import InputFileIcon from '../InputFile/InputFileIcon';
import { convertBytesTo } from '@/libs/utils/handler-data';
import BoxInputSimple from '../BoxInput/BoxInputSimple';
import { PropsBoxInputFile } from '@/types/index.interface';
import styles from './BlockUploadTrack.module.css';

/**
 * Блок для загрузки GPX.
 * isEditing === true устанавливается информирование, что GPX изначально загружен.
 */
export default function BlockUploadTrack({
  title,
  setTrack,
  isLoading,
  resetData,
  isEditing,
  validationText,
}: PropsBoxInputFile) {
  const [trackName, setTrackName] = useState<string>(isEditing ? 'Трэк не заменялся!' : '');
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
      <div className={styles.box__title}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.validate}>{validationText}</span>
      </div>
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
