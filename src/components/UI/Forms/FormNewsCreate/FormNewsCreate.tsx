'use client';

import { FormEvent, Fragment, useState } from 'react';
import { toast } from 'sonner';
import cn from 'classnames';

import { useLoadingStore } from '@/store/loading';
import { serializationNewsCreate } from '@/libs/utils/serialization';
import { useLSNews, useLSNewsInit } from '@/hooks/local_storage/useLSNews';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';
import BlockNewsTextAdd from '../../BlockTextNewsAdd/BlockNewsTextAdd';
import Button from '../../Button/Button';
import BoxInputSimple from '../../BoxInput/BoxInputSimple';
import BoxTextareaSimple from '../../BoxTextarea/BoxTextareaSimple';
import { formateAndStripContent } from './utils';
import type { ResponseServer, TNewsBlocksEdit } from '@/types/index.interface';
import styles from '../Form.module.css';
import { TNewsGetOneDto } from '@/types/dto.types';

type Props = {
  // eslint-disable-next-line no-unused-vars
  fetchNewsCreated: (formData: FormData) => Promise<ResponseServer<any>>;
  newsForEdit: TNewsGetOneDto | null | undefined;
};

const initialBlocks: TNewsBlocksEdit[] = [
  { text: '', image: null, imageFile: null, imageTitle: '', position: 1 },
];
// const suffix = '__bc_moderation_news_create-';
/**
 * Форма создания новости
 * Разделение новости на блоки осуществляется для добавления картинки к соответствующему блоку
 * @returns
 */
export default function FormNewsCreate({ fetchNewsCreated, newsForEdit }: Props) {
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

    // Очищает текст от тэгов html, кроме <a>, <br>.
    // Заменяет символы CRLF перевода строк на html тэг <br>.
    const {
      blockFormatted,
      titleStripedHtmlTags,
      subTitleStripedHtmlTags,
      hashtagsStripedHtmlTags,
    } = formateAndStripContent({ title, subTitle, hashtags, blocks });

    const formData = serializationNewsCreate({
      blocks: blockFormatted,
      title: titleStripedHtmlTags,
      subTitle: subTitleStripedHtmlTags,
      hashtags: hashtagsStripedHtmlTags,
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
    <form onSubmit={onSubmit} className={cn(styles.form, styles.separators)}>
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
  );
}
