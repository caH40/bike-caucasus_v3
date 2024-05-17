/* eslint-disable @next/next/no-img-element */
import { type MouseEvent, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import InputFileIcon from '../InputFile/InputFileIcon';
import { convertBytesTo } from '@/libs/utils/handler-data';
import ButtonClose from '../ButtonClose/ButtonClose';
import styles from './BlockNewsTextAdd.module.css';

import type { TNewsBlocksEdit } from '@/types/index.interface';
import BoxTextareaSimple from '../BoxTextarea/BoxTextareaSimple';

type Props = {
  newsBlock: TNewsBlocksEdit; // новостной блок из новости, текст и изображение(не обязательно)
  newsBlocks: TNewsBlocksEdit[]; // новостной блок из новости, текст и изображение(не обязательно)
  setNewsBlocks: Dispatch<SetStateAction<TNewsBlocksEdit[]>>; // изменение массива newsBlocks
};

export default function BlockNewsTextAdd({ newsBlock, newsBlocks, setNewsBlocks }: Props) {
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

        setNewsBlocks((prev) => {
          const blocks = prev.map((elm) => {
            return elm.position === newsBlock.position
              ? { ...newsBlock, image: dataUrl, imageFile, position: elm.position }
              : elm;
          });

          return blocks;
        });
      }
    };
    reader.readAsDataURL(imageFile);
  };

  // функция получения и формирования данных с нужной структурой для setNewsBlocks
  const handlerInput = (value: string) => {
    setNewsBlocks((prev) => {
      const blocks = prev.map((elm) => {
        return elm.position === newsBlock.position
          ? { ...newsBlock, text: value, position: elm.position }
          : elm;
      });

      return blocks;
    });
  };

  // удаление загруженного изображения
  const deleteImage = () => {
    setNewsBlocks((prev) => {
      const blocks = prev.map((elm) => {
        return elm.position === newsBlock.position
          ? { ...newsBlock, image: null, imageFile: null, position: elm.position }
          : elm;
      });

      return blocks;
    });
  };

  // добавление новостного блока
  const addBlock = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const positionLast = newsBlocks.at(-1)?.position;

    setNewsBlocks([
      ...newsBlocks,
      {
        text: '',
        image: null,
        imageFile: null,
        position: positionLast ? positionLast + 1 : 1,
      },
    ]);
  };

  // удаление новостного блока
  const deleteBlock = (e: MouseEvent<HTMLButtonElement>, position: number): void => {
    e.preventDefault();
    if (newsBlocks.length < 2) {
      return;
    }
    setNewsBlocks((prev) => prev.filter((elm) => elm.position !== position));
  };

  // вставка link
  const getLink = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{`Блок ${newsBlock.position}`}</h2>
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

          <button onClick={getLink} className={styles.btn}>
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

        <button onClick={(e) => deleteBlock(e, newsBlock.position)} className={styles.btn}>
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
        value={newsBlock.text}
        id={`block-${newsBlock.position}`}
        autoComplete="off"
        type="text"
        handlerInput={handlerInput}
      />

      {newsBlock.image && (
        <div className={styles.relative}>
          {/* в данном случае компонент Image не нужен */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={newsBlock.image} alt="image for block" className={styles.img} />

          <ButtonClose getClick={deleteImage} />
          <div className={styles.top} />
        </div>
      )}
    </section>
  );
}
