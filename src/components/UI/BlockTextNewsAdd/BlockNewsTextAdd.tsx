import {
  type MouseEvent,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useRef,
} from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import InputFileIcon from '../InputFile/InputFileIcon';
import { convertBytesTo } from '@/libs/utils/handler-data';
import ButtonClose from '../ButtonClose/ButtonClose';
import BoxTextareaSimple from '../BoxTextarea/BoxTextareaSimple';
import useInsertLink from '@/hooks/link-insert';
import styles from './BlockNewsTextAdd.module.css';
import ModalSimple from '../Modal/ModalInput';
import Button from '../Button/Button';
import BoxInputSimple from '../BoxInput/BoxInputSimple';
import type { TBlockInputInfo } from '@/types/index.interface';

type Props = {
  block: TBlockInputInfo; // новостной блок из новости, текст и изображение(не обязательно)
  blocks: TBlockInputInfo[]; // новостной блок из новости, текст и изображение(не обязательно)
  setBlocks: Dispatch<SetStateAction<TBlockInputInfo[]>>; // изменение массива blocks
  isLoading: boolean;
};

export default function BlockNewsTextAdd({ block, blocks, setBlocks, isLoading }: Props) {
  const refTextArea = useRef<HTMLTextAreaElement>(null);

  // Хук фитчи вставки link вместо выделенного текста.
  const { showModal, setShowModal, url, setUrl, handleInsertLink, handleSelection } =
    useInsertLink({
      refTextArea,
      handlerInput: handlerTextareaText,
      block,
    });

  // обработка загрузки изображения
  const getImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0] || null;

    if (!imageFile) {
      return;
    }

    // проверка на максимальный разрешенный размер загружаемого файла
    const maxSizeFileInMBytes = 7;
    const sizeFileInMBytes = convertBytesTo(imageFile.size, 'mB');
    if (sizeFileInMBytes > maxSizeFileInMBytes) {
      return toast.error(`Размер файла не должен превышать ${maxSizeFileInMBytes} МБайт`);
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      if (e.target && typeof e.target.result === 'string') {
        const dataUrl = e.target.result;

        setBlocks((prev) => {
          const blocks = prev.map((elm) => {
            return elm.position === block.position
              ? {
                  ...block,
                  image: dataUrl,
                  imageFile,
                  position: elm.position,
                  imageDeleted: false,
                }
              : elm;
          });

          return blocks;
        });
      }
    };
    reader.readAsDataURL(imageFile);
  };

  // функция получения и формирования данных с нужной структурой для setBlocks
  function handlerInputCommon(property: string, value: string) {
    setBlocks((prev) => {
      const blocks = prev.map((elm) => {
        return elm.position === block.position
          ? { ...block, position: elm.position, [property]: value }
          : elm;
      });

      return blocks;
    });
  }

  // при вводе в Input для свойства Title
  function handlerInputTitle(value: string) {
    handlerInputCommon('title', value);
  }

  // при вводе в Textarea для свойства text
  function handlerTextareaText(value: string) {
    handlerInputCommon('text', value);
  }

  // при вводе в Input для свойства imageTitle
  function handlerInputImageTitle(value: string) {
    handlerInputCommon('imageTitle', value);
  }

  // при вводе в Input для свойства Video
  function handlerInputVideo(value: string) {
    handlerInputCommon('video', value);
  }

  // удаление загруженного изображения
  const deleteImage = () => {
    setBlocks((prev) => {
      const blocks = prev.map((elm) => {
        return elm.position === block.position
          ? {
              ...block,
              image: null,
              imageFile: null,
              imageTitle: '',
              imageDeleted: true,
              position: elm.position,
            }
          : elm;
      });

      return blocks;
    });
  };

  // добавление новостного блока
  const addBlock = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const positionLast = blocks.at(-1)?.position;

    setBlocks([
      ...blocks,
      {
        text: '',
        image: null,
        imageFile: null,
        imageTitle: '',
        title: '',
        video: '',
        position: positionLast ? positionLast + 1 : 1,
      },
    ]);
  };

  // удаление новостного блока
  const deleteBlock = (e: MouseEvent<HTMLButtonElement>, position: number): void => {
    e.preventDefault();
    if (blocks.length < 2) {
      return;
    }
    setBlocks((prev) => prev.filter((elm) => elm.position !== position));
  };

  return (
    <section className={styles.wrapper}>
      {/* Модальное окно ввода url линка для выделенного текста в области textarea */}
      {showModal && (
        <ModalSimple>
          <h4 className={styles.title__modal}>Ведите полный url</h4>
          <input
            className={styles.input}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className={styles.btn__insert__link}>
            <Button getClick={handleInsertLink} name="Вставить Link" />
          </div>
          <Button
            getClick={() => {
              setShowModal(false);
            }}
            name="Отмена"
          />
        </ModalSimple>
      )}

      <h3 className={styles.title}>{`Блок текста и изображения к нему №${block.position}`}</h3>

      <div className={styles.wrapper__inputs}>
        <div>
          {/* Иконки управления блоком */}
          <div className={styles.block__icons}>
            <div className={styles.block__icons_left}>
              <InputFileIcon
                name="uploadImage"
                icon={{
                  width: 26,
                  height: 22,
                  src: '/images/icons/image-upload.svg',
                  alt: 'Upload image',
                }}
                accept=".jpg, .jpeg, .png, .webp"
                getChange={getImage}
              />
              <button onClick={handleSelection} className={styles.btn}>
                <Image
                  width={26}
                  height={22}
                  src="/images/icons/link.svg"
                  alt="Insert a link"
                  className={styles.icon__img}
                />
              </button>
            </div>

            <div className={styles.block__icons_right}>
              <button onClick={(e) => addBlock(e)} className={styles.btn}>
                <Image
                  width={26}
                  height={22}
                  src="/images/icons/add-square.svg"
                  alt="Insert a link"
                  className={styles.icon__img}
                />
              </button>
              {block.position !== 1 && (
                <button onClick={(e) => deleteBlock(e, block.position)} className={styles.btn}>
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
          </div>

          {/* Текст блока (новость, описание маршрута и т.д.) */}
          <BoxTextareaSimple
            value={block.text}
            name={`block-${block.text}`}
            id={`block-${block.text}`}
            loading={isLoading}
            autoComplete="off"
            type="text"
            handlerInput={handlerTextareaText}
            showValidationText={true}
            validationText={block.text.length > 200 ? '' : 'от 200 символов!'}
            refTextArea={refTextArea}
          />
        </div>

        {/* Заголовок текстового блока */}
        <BoxInputSimple
          id={`block-${block.title}`}
          name={`block-${block.title}`}
          value={block.title}
          handlerInput={handlerInputTitle}
          type={'text'}
          label="Заголовок:"
          loading={isLoading}
          autoComplete={'off'}
        />

        {/* Блок отображения изображения и ввода описания к нему */}
        {block.image && (
          <>
            <div className={styles.relative}>
              {/* в данном случае компонент Image не нужен */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={block.image} alt="image for block" className={styles.img} />

              <ButtonClose getClick={deleteImage} />
              <div className={styles.top} />
            </div>

            {/* Заголовок текстового блока */}
            <BoxInputSimple
              id={`block-${block.imageTitle}`}
              name={`block-${block.imageTitle}`}
              value={block.imageTitle}
              handlerInput={handlerInputImageTitle}
              type={'text'}
              label="Краткое описание изображения:*"
              loading={isLoading}
              autoComplete={'off'}
              showValidationText={true}
              validationText={
                block.imageTitle && block.imageTitle?.length < 70 ? '' : 'не больше 70 символов'
              }
            />
          </>
        )}

        {/* Ссылка на видео в Youtube */}
        <BoxInputSimple
          id={`block-${block.video}`}
          name={`block-${block.video}`}
          value={block.video}
          handlerInput={handlerInputVideo}
          type={'text'}
          label="Ссылка на видео в Youtube:"
          loading={isLoading}
          autoComplete={'off'}
          showValidationText={true}
          validationText={
            block.video
              ? block.video.startsWith('https://www.yout')
                ? ''
                : 'начало с https://www.yout'
              : ''
          } // Необязательный, но если есть, то должен начинаться с https://yout
        />
      </div>
    </section>
  );
}
