'use client';

import { FormEvent, Fragment, useState } from 'react';
import { toast } from 'sonner';

import { useLoadingStore } from '@/store/loading';
import FormWrapper from '../FormWrapper/FormWrapper';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';
import BlockNewsTextAdd from '../../BlockTextNewsAdd/BlockNewsTextAdd';
import Button from '../../Button/Button';
import BoxInputSimple from '../../BoxInput/BoxInputSimple';
import BoxTextareaSimple from '../../BoxTextarea/BoxTextareaSimple';
import type { MessageServiceDB, TNewsBlocksEdit } from '@/types/index.interface';
import styles from '../Form.module.css';
import { serializationNewsCreate } from '@/libs/utils/serialization';

type Props = {
  fetchNewsCreated: (formData: FormData) => Promise<MessageServiceDB<any>>;
};

const initialData: TNewsBlocksEdit[] = [
  { text: '', image: null, imageFile: null, position: 1 },
];

/**
 * Форма создания новости
 * Разделение новости на блоки осуществляется для добавления картинки к соответствующему блоку
 * @returns
 */
export default function FormNewsCreate({ fetchNewsCreated }: Props) {
  const [newsBlocks, setNewsBlocks] = useState<TNewsBlocksEdit[]>(initialData);
  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [hashtag, setHashtag] = useState<string>('');
  const [fileImageTitle, setFileImageTitle] = useState<File | null>(null);

  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  // хэндлер отправки формы
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fileImageTitle || !title || !subTitle || !hashtag) {
      toast.error('Не заполнены все обязательные поля!');
      return;
    }
    const formData = serializationNewsCreate({
      newsBlocks,
      title,
      subTitle,
      hashtag,
      fileImageTitle,
    });

    const response = await fetchNewsCreated(formData);
    if (response.ok) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  // загрузка основного изображения

  return (
    <FormWrapper title={'Создание новости'}>
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

        <BoxInputSimple
          id="hashtag"
          name="hashtag"
          value={hashtag}
          handlerInput={setHashtag}
          type={'text'}
          label="Хэштеги:* (например: анонс, результаты, мтб, шоссе, кк, пвд, кисловодск, море, горы)"
          loading={isLoading}
          autoComplete={'off'}
          validationText={hashtag.length > 3 ? '' : 'пустое!'} // необходима проверка?
        />

        <div className={styles.box__button}>
          <Button name="Опубликовать" theme="green" loading={isLoading} />
        </div>
      </form>
    </FormWrapper>
  );
}
