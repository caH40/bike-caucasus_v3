'use client';

import { FormEvent, Fragment, useState } from 'react';
import { toast } from 'sonner';

import { useLoadingStore } from '@/store/loading';
import Wrapper from '../../../Wrapper/Wrapper';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';
import BlockNewsTextAdd from '../../BlockTextNewsAdd/BlockNewsTextAdd';
import Button from '../../Button/Button';
import BoxInputSimple from '../../BoxInput/BoxInputSimple';
import BoxTextareaSimple from '../../BoxTextarea/BoxTextareaSimple';
import type { MessageServiceDB, TNewsBlocksEdit } from '@/types/index.interface';
import styles from '../Form.module.css';
import { serializationNewsCreate } from '@/libs/utils/serialization';
import { useLSNews, useLSNewsInit } from '@/hooks/local_storage/useLSNews';

type Props = {
  // eslint-disable-next-line no-unused-vars
  fetchNewsCreated: (formData: FormData) => Promise<MessageServiceDB<any>>;
};

const initialBlocks: TNewsBlocksEdit[] = [
  { text: '', image: null, imageFile: null, position: 1 },
];
// const suffix = '__bc_moderation_news_create-';
/**
 * Форма создания новости
 * Разделение новости на блоки осуществляется для добавления картинки к соответствующему блоку
 * @returns
 */
export default function FormNewsCreate({ fetchNewsCreated }: Props) {
  const [blocks, setBlocks] = useState<TNewsBlocksEdit[]>(initialBlocks);
  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [hashtags, setHashtags] = useState<string>('');
  const [poster, setPoster] = useState<File | null>(null);
  const [resetData, setResetData] = useState<boolean>(false);

  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  // инициализация данных полей при монтировании из Локального хранилища.
  useLSNewsInit({
    setBlocks,
    setTitle,
    setSubTitle,
    setHashtags,
    initialBlocks,
  });

  // сохранение данных текстовых полей в Локальном хранилище.
  useLSNews({ title, subTitle, hashtags, blocks, resetData });

  // хэндлер отправки формы
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!poster || !title || !subTitle || !hashtags) {
      toast.error('Не заполнены все обязательные поля!');
      return;
    }

    // Отображения спинера загрузки.
    setLoading(true);

    const formData = serializationNewsCreate({
      blocks,
      title,
      subTitle,
      hashtags,
      poster,
    });

    const response = await fetchNewsCreated(formData);
    if (response.ok) {
      setBlocks(initialBlocks);
      setTitle('');
      setSubTitle('');
      setHashtags('');
      setPoster(null);
      setResetData(true);
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  // загрузка основного изображения

  return (
    <Wrapper title={'Создание новости'}>
      <form onSubmit={onSubmit} className={styles.form}>
        <BoxInputSimple
          id="title"
          name="title"
          value={title}
          handlerInput={setTitle}
          type={'text'}
          label="Заголовок:*"
          loading={isLoading}
          autoComplete={'off'}
          validationText={title.length > 10 ? '' : 'пустое!'} // необходима проверка?
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
          validationText={subTitle.length > 20 ? '' : 'пустое!'} // необходима проверка?
        />

        {/* Блок загрузки Титульного изображения */}
        <BlockUploadImage
          title={'Титульное изображение:*'}
          poster={poster}
          setPoster={setPoster}
          resetData={resetData}
        />

        {/* Блок добавления текста и изображения новости */}
        {blocks.map((block) => (
          <Fragment key={block.position}>
            <BlockNewsTextAdd
              block={block}
              blocks={blocks}
              setBlocks={setBlocks}
              isLoading={isLoading}
            />
          </Fragment>
        ))}

        <BoxInputSimple
          id="hashtag"
          name="hashtag"
          value={hashtags}
          handlerInput={setHashtags}
          type={'text'}
          label="Хэштеги:* (например: анонс, результаты, мтб, шоссе, кк, пвд, кисловодск, море, горы)"
          loading={isLoading}
          autoComplete={'off'}
          validationText={hashtags.length >= 3 ? '' : 'пустое!'} // необходима проверка?
        />

        <div className={styles.box__button}>
          <Button name="Опубликовать" theme="green" loading={isLoading} />
        </div>
      </form>
    </Wrapper>
  );
}
