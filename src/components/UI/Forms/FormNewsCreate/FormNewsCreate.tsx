'use client';

import { useLoadingStore } from '@/store/loading';
import BoxInput from '../../BoxInput/BoxInput';
import FormWrapper from '../FormWrapper/FormWrapper';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import type { TNews } from '@/types/models.interface';
import styles from '../Form.module.css';
import { useState } from 'react';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';

type Props = {
  dataFromAPI: TNews;
};

/**
 * Форма создания новости
 * Разделение новости на блоки осуществляется для добавления картинки к соответствующему блоку
 * @returns
 */
export default function FormNewsCreate({ dataFromAPI }: Props) {
  const [news, setNews] = useState<TNews>(dataFromAPI);
  const [fileImageTitle, setFileImageTitle] = useState<File | null>(null);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  // хэндлер отправки формы
  const onSubmit = () => {};

  // добавление новостного блока
  const addBlock = (): void => {
    const positionLast = news.blocks.at(-1)?.position;

    setNews({
      ...news,
      blocks: [{ text: '', image: null, position: positionLast ? positionLast + 1 : 1 }],
    });
  };

  // удаление новостного блока
  const deleteBlock = (position: number): void => {
    const blocks = news.blocks.filter((block) => block.position !== position);

    setNews({ ...news, blocks });
  };

  // загрузка основного изображения

  return (
    <FormWrapper title={'Создание новости'}>
      <form onSubmit={() => onSubmit()} className={styles.form}>
        <BoxInput
          id="title"
          name="title"
          type={'text'}
          label="Заголовок:*"
          loading={isLoading}
          autoComplete={'off'}
          validationText={''} // необходима проверка?
        />
        <BoxTextarea
          id="subTitle"
          name="subTitle"
          type={'text'}
          label="Краткое содержание:*"
          loading={isLoading}
          autoComplete={'off'}
          validationText={''} // необходима проверка?
        />
        <BlockUploadImage
          fileImageTitle={fileImageTitle}
          setFileImageTitle={setFileImageTitle}
        />
      </form>
    </FormWrapper>
  );
}
