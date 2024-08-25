import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

import InputFileIcon from '../InputFile/InputFileIcon';
import BoxInputSimple from '../BoxInput/BoxInputSimple';
import { convertBytesTo } from '@/libs/utils/handler-data';
import { PropsBoxInputFile } from '@/types/index.interface';
import styles from './BlockUploadTrack.module.css';
import IconInfo from '@/components/Icons/IconInfo';

/**
 * Блок для загрузки GPX.
 * isEditing === true устанавливается информирование, что GPX изначально загружен.
 */
export default function BlockUploadTrack({
  title,
  setTrack,
  isLoading,
  resetData,
  value,
  isRequired,
  validationText,
  needDelTrack, // Если выбор файла обязателен isRequired:true, то данные переменные не нужны.
  setNeedDelTrack, // Если выбор файла обязателен isRequired:true, то данные переменные не нужны.
  tooltip,
}: PropsBoxInputFile) {
  const [trackName, setTrackName] = useState<string>(value);

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
  const removeFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (setNeedDelTrack) {
      setNeedDelTrack((prev) => !prev);
    }
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
      <div className={styles.block__control}>
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

        {!isRequired && (
          <button onClick={removeFile} className={styles.btn}>
            <Image
              width={26}
              height={22}
              src="/images/icons/delete-square.svg"
              alt="Insert a link"
              className={styles.icon__img}
            />
          </button>
        )}
      </div>

      <BoxInputSimple
        value={needDelTrack ? 'При обновлении трек будет удалён!' : trackName}
        disabled={true}
        id={'fileGPX'}
        name={'fileGPX'}
        autoComplete=""
        type="text"
        handlerInput={setTrackName}
        validationText={isRequired ? (trackName.length > 3 ? '' : 'Загрузите файл') : ''}
      />
    </section>
  );
}
