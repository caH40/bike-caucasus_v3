'use client';

import { Fragment, useState } from 'react';

import { useLoadingStore } from '@/store/loading';
import FormWrapper from '../FormWrapper/FormWrapper';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';
import BlockNewsTextAdd from '../../BlockTextNewsAdd/BlockNewsTextAdd';
import Button from '../../Button/Button';
import type { TNewsBlocksEdit } from '@/types/index.interface';
import styles from '../Form.module.css';
import BoxInputSimple from '../../BoxInput/BoxInputSimple';
import BoxTextareaSimple from '../../BoxTextarea/BoxTextareaSimple';

type Props = {};

const initialData: TNewsBlocksEdit[] = [
  { text: '', image: null, imageFile: null, position: 1 },
];

/**
 * Форма создания новости
 * Разделение новости на блоки осуществляется для добавления картинки к соответствующему блоку
 * @returns
 */
export default function FormNewsCreate({}: Props) {
  const [newsBlocks, setNewsBlocks] = useState<TNewsBlocksEdit[]>(initialData);
  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [fileImageTitle, setFileImageTitle] = useState<File | null>(null);

  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  // хэндлер отправки формы
  const onSubmit = () => {};

  // загрузка основного изображения

  return (
    <FormWrapper title={'Создание новости'}>
      <form onSubmit={() => onSubmit()} className={styles.form}>
        <BoxInputSimple
          id="title"
          name="title"
          value={title}
          handlerInput={setTitle}
          type={'text'}
          label="Заголовок:*"
          loading={isLoading}
          autoComplete={'off'}
          validationText={''} // необходима проверка?
        />
        <BoxTextareaSimple
          id="subTitle"
          name="subTitle"
          value={subTitle}
          handlerInput={setSubTitle}
          type={'text'}
          label="Краткое содержание:*"
          loading={isLoading}
          autoComplete={'off'}
          validationText={''} // необходима проверка?
        />

        {/* Блок загрузки Титульного изображения */}
        <BlockUploadImage
          title={'Титульное изображение:*'}
          fileImageTitle={fileImageTitle}
          setFileImageTitle={setFileImageTitle}
        />

        {/* <hr className={styles.line} /> */}
        {/* Блок добавления текста и изображения новости */}
        {newsBlocks.map((newsBlock) => (
          <Fragment key={newsBlock.position}>
            <BlockNewsTextAdd
              newsBlock={newsBlock}
              newsBlocks={newsBlocks}
              setNewsBlocks={setNewsBlocks}
            />
            {/* <hr className={styles.line} /> */}
          </Fragment>
        ))}

        <div className={styles.box__button}>
          <Button name="Опубликовать" theme="green" loading={isLoading} />
        </div>
      </form>
    </FormWrapper>
  );
}
