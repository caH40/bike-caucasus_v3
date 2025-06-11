'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import cn from 'classnames';

import { getInitialBlocks } from './initial-block';
import { useLoadingStore } from '@/store/loading';
import { serializationNewsCreate } from '@/libs/utils/serialization/news';
import { useLSNews, useLSNewsInit } from '@/hooks/local_storage/useLSNews';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';
import BlockNewsTextAdd from '../../BlockTextNewsAdd/BlockNewsTextAdd';
import Button from '../../Button/Button';
import BoxInputSimple from '../../BoxInput/BoxInputSimple';
import BoxTextareaSimple from '../../BoxTextarea/BoxTextareaSimple';
import { formateAndStripContent } from './utils';
import CheckboxRounded from '../../CheckboxRounded/CheckboxRounded';
import type { ServerResponse, TBlockInputInfo } from '@/types/index.interface';
import type { TNewsGetOneDto } from '@/types/dto.types';
import styles from '../Form.module.css';
import BlockUploadFile from '../../BlockUploadFile/BlockUploadFile';
import { useUserData } from '@/store/userdata';

type Props = {
  postNews?: (formData: FormData) => Promise<ServerResponse<any>>; // eslint-disable-line no-unused-vars
  putNewsOne?: (formData: FormData) => Promise<ServerResponse<any>>; // eslint-disable-line no-unused-vars
  newsForEdit?: TNewsGetOneDto & { posterOldUrl?: string | null };
};

/**
 * Форма создания новости
 * Разделение новости на блоки осуществляется для добавления картинки к соответствующему блоку
 * Если newsForEdit не undefined, значит происходит редактирование Новости, иначе создание.
 * @returns
 */
export default function FormNews({ postNews, putNewsOne, newsForEdit }: Props) {
  // Мета данные по client.
  const { location, deviceInfo } = useUserData();

  // Новостные блоки в новости.
  const [blocks, setBlocks] = useState<TBlockInputInfo[]>(() =>
    getInitialBlocks(newsForEdit?.blocks)
  );

  // Заголовок новости.
  const [title, setTitle] = useState<string>(newsForEdit ? newsForEdit.title : '');
  // Подзаголовок новости.
  const [subTitle, setSubTitle] = useState<string>(newsForEdit ? newsForEdit.subTitle : '');
  const [important, setImportant] = useState<boolean>(
    newsForEdit ? !!newsForEdit.important : false
  );
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
  // Протокол или другой файл в формате pdf.
  const [filePdf, setFilePdf] = useState<File | null>(null);
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
    setImportant,
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
    important,
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
      important,
      poster,
      urlSlug: newsForEdit?.urlSlug,
      posterOldUrl: newsForEdit?.posterOldUrl,
      filePdf,
      client: {
        location,
        deviceInfo,
      },
    });

    let response = {
      data: null,
      ok: false,
      message: 'Не передана ни функция обновления, ни создания новости!',
    };
    if (postNews) {
      response = await postNews(formData);
    } else if (putNewsOne) {
      response = await putNewsOne(formData);
    } else {
      return toast.error('Не передана ни функция обновления, ни функция создания!');
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
    <form onSubmit={onSubmit} className={cn(styles.form, styles.separators)}>
      <div className={styles.wrapper__block}>
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

        <CheckboxRounded
          value={important}
          setValue={setImportant}
          label={'Важная новость'}
          id="important"
        />
      </div>

      {/* Блок загрузки Трэка маршрута в формате GPX */}
      <BlockUploadFile
        title={'Загрузка PDF файла:'}
        setFile={setFilePdf}
        resetData={resetData}
        isEditing={!!newsForEdit}
        accept={'.pdf'}
      />

      {/* Блок добавления текста и изображения новости */}
      {blocks.map((block) => (
        <div className={styles.wrapper__block} key={block.position}>
          <BlockNewsTextAdd
            block={block}
            blocks={blocks}
            setBlocks={setBlocks}
            isLoading={isLoading}
          />
        </div>
      ))}

      <div className={styles.box__button}>
        <Button name="Опубликовать" theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
