import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';

import InputFileIcon from '../InputFile/InputFileIcon';
import { convertBytesTo } from '@/libs/utils/handler-data';
import BoxInputSimple from '../BoxInput/BoxInputSimple';
import styles from './BlockUploadFile.module.css';

type Props = {
  title?: string;
  isLoading?: boolean;
  setFile: Dispatch<SetStateAction<File | null>>;
  resetData: boolean; // Триггер сброса изображения.
  isEditing: boolean; // Режим редактирования Маршрута?
  accept: string; // Расширения загружаемых файлов.
};

/**
 * Блок для загрузки Титульного изображения для новости
 * Устанавливает в setPoster данные типа File, показывает загруженное изображения для контроля
 * isEditing === true устанавливается информирование, что GPX изначально загружен.
 */
export default function BlockUploadFile({
  title,
  setFile,
  isLoading,
  resetData,
  isEditing,
  accept,
}: Props) {
  const [fileName, setFileName] = useState<string>(isEditing ? 'Файл не заменялся!' : '');
  // Сброс отображаемого изображения после отправки формы.
  useEffect(() => {
    setFile(null);
  }, [resetData, setFile]);

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

    setFile(file);
    setFileName(file.name);
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <InputFileIcon
        name="uploadTrack"
        icon={{
          width: 26,
          height: 22,
          src: '/images/icons/upload.svg',
          alt: `Upload file ${accept}`,
        }}
        accept={accept}
        getChange={getFile}
        loading={isLoading}
      />
      <BoxInputSimple
        value={fileName}
        disabled={true}
        id={'fileUpload'}
        name={'fileUpload'}
        autoComplete=""
        type="text"
        handlerInput={setFileName}
        validationText={fileName.length > 0 ? '' : 'Загрузите файл'}
      />
    </section>
  );
}
