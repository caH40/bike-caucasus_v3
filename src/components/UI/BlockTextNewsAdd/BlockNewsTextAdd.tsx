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
import type { TNewsBlocksEdit } from '@/types/index.interface';
import BoxTextareaSimple from '../BoxTextarea/BoxTextareaSimple';
import useInsertLink from '@/hooks/link-insert';
import styles from './BlockNewsTextAdd.module.css';
import ModalSimple from '../Modal/ModalInput';
import Button from '../Button/Button';
import BoxInputSimple from '../BoxInput/BoxInputSimple';

type Props = {
  block: TNewsBlocksEdit; // новостной блок из новости, текст и изображение(не обязательно)
  blocks: TNewsBlocksEdit[]; // новостной блок из новости, текст и изображение(не обязательно)
  setBlocks: Dispatch<SetStateAction<TNewsBlocksEdit[]>>; // изменение массива blocks
  isLoading: boolean;
};

export default function BlockNewsTextAdd({ block, blocks, setBlocks, isLoading }: Props) {
  const refTextArea = useRef<HTMLTextAreaElement>(null);

  // Хук фитчи вставки link вместо выделенного текста.
  const { showModal, setShowModal, url, setUrl, handleInsertLink, handleSelection } =
    useInsertLink({
      refTextArea,
      handlerInput,
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
  // при вводе в Textarea для свойства text
  function handlerInput(value: string) {
    setBlocks((prev) => {
      const blocks = prev.map((elm) => {
        return elm.position === block.position
          ? { ...block, text: value, position: elm.position }
          : elm;
      });

      return blocks;
    });
  }

  // функция получения и формирования данных с нужной структурой для setBlocks
  // при вводе в Input для свойства imageTitle
  function handlerInputImage(value: string) {
    setBlocks((prev) => {
      const blocks = prev.map((elm) => {
        return elm.position === block.position
          ? { ...block, imageTitle: value, position: elm.position }
          : elm;
      });

      return blocks;
    });
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

      <h2 className={styles.title}>{`Блок текста и изображения к нему №${block.position}`}</h2>
      <div className={styles.block__icons}>
        <div className={styles.block__icons__right}>
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

          <button onClick={(e) => addBlock(e)} className={styles.btn}>
            <Image
              width={26}
              height={22}
              src="/images/icons/add-square.svg"
              alt="Insert a link"
              className={styles.icon__img}
            />
          </button>
        </div>

        <button onClick={(e) => deleteBlock(e, block.position)} className={styles.btn}>
          <Image
            width={26}
            height={22}
            src="/images/icons/delete-square.svg"
            alt="Insert a link"
            className={styles.icon__img}
          />
        </button>
      </div>
      <BoxTextareaSimple
        value={block.text}
        name={`block-${block.position}`}
        id={`block-${block.position}`}
        loading={isLoading}
        autoComplete="off"
        type="text"
        handlerInput={handlerInput}
        validationText={block.text.length > 30 ? '' : 'пустое!'}
        refTextArea={refTextArea}
      />

      {block.image && (
        <>
          <div className={styles.relative}>
            {/* в данном случае компонент Image не нужен */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.image} alt="image for block" className={styles.img} />

            <ButtonClose getClick={deleteImage} />
            <div className={styles.top} />
          </div>
          <BoxInputSimple
            id={`block-${block.imageTitle}`}
            name={`block-${block.imageTitle}`}
            value={block.imageTitle}
            handlerInput={handlerInputImage}
            type={'text'}
            label="Краткое описание изображения:"
            loading={isLoading}
            autoComplete={'off'}
            showValidationText={true}
            validationText={block.imageTitle?.length < 70 ? '' : 'не больше 70 символов'} // необходима проверка?
          />
        </>
      )}
    </section>
  );
}
