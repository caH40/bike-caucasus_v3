'use client';

import { FormEvent, Fragment, useState } from 'react';
import { toast } from 'sonner';
import cn from 'classnames';

import { getInitialBlocks } from './initial-block';
import { useLoadingStore } from '@/store/loading';
import { serializationNewsCreate } from '@/libs/utils/serialization';
import { useLSNews, useLSNewsInit } from '@/hooks/local_storage/useLSNews';
import Wrapper from '../../../Wrapper/Wrapper';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';
import BlockNewsTextAdd from '../../BlockTextNewsAdd/BlockNewsTextAdd';
import Button from '../../Button/Button';
import BoxInputSimple from '../../BoxInput/BoxInputSimple';
import BoxTextareaSimple from '../../BoxTextarea/BoxTextareaSimple';
import { formateAndStripContent } from './utils';
import type { ResponseServer, TBlockInputInfo } from '@/types/index.interface';
import { TNewsGetOneDto } from '@/types/dto.types';
import styles from '../Form.module.css';
import { useRouter } from 'next/navigation';

type Props = {
  fetchNewsCreated?: (formData: FormData) => Promise<ResponseServer<any>>; // eslint-disable-line no-unused-vars
  fetchNewsEdited?: (formData: FormData) => Promise<ResponseServer<any>>; // eslint-disable-line no-unused-vars
  newsForEdit?: TNewsGetOneDto & { posterOldUrl?: string | null };
};

/**
 * Форма создания новости
 * Разделение новости на блоки осуществляется для добавления картинки к соответствующему блоку
 * Если newsForEdit не undefined, значит происходит редактирование Новости, иначе создание.
 * @returns
 */
export default function FormNews({ fetchNewsCreated, fetchNewsEdited, newsForEdit }: Props) {
  // Новостные блоки в новости.
  const [blocks, setBlocks] = useState<TBlockInputInfo[]>(() =>
    getInitialBlocks(newsForEdit?.blocks)
  );

  // Заголовок новости.
  const [title, setTitle] = useState<string>(newsForEdit ? newsForEdit.title : '');
  // Подзаголовок новости.
  const [subTitle, setSubTitle] = useState<string>(newsForEdit ? newsForEdit.subTitle : '');
  // Хэштэги новости.
  const [hashtags, setHashtags] = useState<string>(
    newsForEdit ? newsForEdit.hashtags.join(' ') : ''
  );
  // Постер новости в формате File.
  const [poster, setPoster] = useState<File | null>(null);
  // Постер новости существует при редактировании, url на изображение.
  const [posterUrl, setPosterUrl] = useState<string | null>(
    newsForEdit ? newsForEdit.poster : null
  );

  // Триггер очистки форм и Локального хранилища.
  const [resetData, setResetData] = useState<boolean>(false);

  const router = useRouter();

  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  // инициализация данных полей при монтировании из Локального хранилища.
  useLSNewsInit({
    target: newsForEdit ? 'edit' : 'create',
    setBlocks,
    setTitle,
    setSubTitle,
    setHashtags,
    isEditing: newsForEdit ? true : false,
    initialBlocks: getInitialBlocks(newsForEdit?.blocks),
  });

  // сохранение данных текстовых полей в Локальном хранилище.
  useLSNews({
    title,
    subTitle,
    hashtags,
    blocks,
    resetData,
    target: newsForEdit ? 'edit' : 'create',
  });

  // хэндлер отправки формы
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!(poster || posterUrl) || !title || !subTitle || !hashtags) {
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
      urlSlug: newsForEdit?.urlSlug,
      posterOldUrl: newsForEdit?.posterOldUrl,
    });

    let response = {
      data: null,
      ok: false,
      message: 'Не передана ни функция обновления, ни создания новости!',
    };
    if (fetchNewsCreated) {
      response = await fetchNewsCreated(formData);
    } else if (fetchNewsEdited) {
      response = await fetchNewsEdited(formData);
    } else {
      return toast.error('Не передана ни функция обновления, ни создания новости!');
    }

    if (response.ok) {
      setBlocks(getInitialBlocks());
      setTitle('');
      setSubTitle('');
      setHashtags('');
      setPoster(null);
      setResetData(true);
      setPosterUrl(null);
      toast.success(response.message);
      router.push(`/`);
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  // загрузка основного изображения

  return (
    <Wrapper title={'Форма ввода данных'} hSize={2}>
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
          posterUrl={posterUrl}
          setPosterUrl={setPosterUrl}
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
