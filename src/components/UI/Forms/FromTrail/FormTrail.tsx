'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import cn from 'classnames';

import { getInitialBlocks } from './initial-block';
import { useLoadingStore } from '@/store/loading';
import { useLSTrail } from '@/hooks/local_storage/useLSTrail';
import { useLSTrailInit } from '@/hooks/local_storage/useLSTrailInit';
import {
  regions as regionsOptions,
  difficultyLevel as difficultyLevelOptions,
} from '@/constants/trail';
import Wrapper from '../../../Wrapper/Wrapper';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';
import BlockNewsTextAdd from '../../BlockTextNewsAdd/BlockNewsTextAdd';
import Button from '../../Button/Button';
import BoxInputSimple from '../../BoxInput/BoxInputSimple';
import BoxSelectSimple from '../../BoxSelect/BoxSelectSimple';
import type { ResponseServer, TBlockInputInfo } from '@/types/index.interface';
import type { TTrailDto } from '@/types/dto.types';
import styles from '../Form.module.css';
import { formateAndStripContent } from './utils';
import { serializationTrailCreate } from '@/libs/utils/serialization/trail';

type Props = {
  fetchTrailCreated?: (formData: FormData) => Promise<ResponseServer<any>>; // eslint-disable-line no-unused-vars
  fetchTrailEdited?: (formData: FormData) => Promise<ResponseServer<any>>; // eslint-disable-line no-unused-vars
  trailForEdit?: TTrailDto & { posterOldUrl?: string | null };
};

/**
 * Форма создания и редактирования Маршрута (trail)
 * Разделение описания маршрута на блоки осуществляется для добавления картинки,
 * видео с ютуба к соответствующему блоку.
 * Если trailForEdit не undefined, значит происходит редактирование Маршрута, иначе создание.
 * @returns
 */
export default function FormTrail({
  fetchTrailCreated,
  fetchTrailEdited,
  trailForEdit,
}: Props) {
  const [title, setTitle] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [difficultyLevel, setDifficultyLevel] = useState<string>('');
  const [startLocation, setStartLocation] = useState<string>('');
  const [turnLocation, setTurnLocation] = useState<string>('');
  const [finishLocation, setFinishLocation] = useState<string>('');
  const [distance, setDistance] = useState<number>(0);
  const [ascent, setAscent] = useState<number>(0);
  const [garminConnect, setGarminConnect] = useState<string>('');
  const [komoot, setKomoot] = useState<string>('');
  const [blocks, setBlocks] = useState<TBlockInputInfo[]>(() =>
    getInitialBlocks(trailForEdit?.blocks)
  );
  // console.log({ difficultyLevel, region });

  // Хэштэги новости.
  const [hashtags, setHashtags] = useState<string>('');
  // Постер новости в формате File.
  const [poster, setPoster] = useState<File | null>(null);
  // Постер новости существует при редактировании, url на изображение.
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  // Триггер очистки форм и Локального хранилища.
  const [resetData, setResetData] = useState<boolean>(false);

  const router = useRouter();

  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  // инициализация данных полей при монтировании из Локального хранилища.
  useLSTrailInit({
    target: trailForEdit ? 'edit' : 'create',
    setBlocks,
    setTitle,
    setRegion,
    setDifficultyLevel,
    setStartLocation,
    setTurnLocation,
    setFinishLocation,
    setDistance,
    setAscent,
    setGarminConnect,
    setKomoot,
    setHashtags,
    isEditing: trailForEdit ? true : false,
    initialBlocks: getInitialBlocks(trailForEdit?.blocks),
  });

  // сохранение данных текстовых полей в Локальном хранилище.
  useLSTrail({
    title,
    region,
    difficultyLevel,
    startLocation,
    turnLocation,
    finishLocation,
    distance,
    ascent,
    garminConnect,
    komoot,
    hashtags,
    blocks,
    resetData,
    target: trailForEdit ? 'edit' : 'create',
  });

  // хэндлер отправки формы
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!(poster || posterUrl) || !title || !hashtags) {
      toast.error('Не заполнены все обязательные поля!');
      return;
    }

    // Отображения спинера загрузки.
    setLoading(true);

    // Очищает текст от тэгов html, кроме <a>, <br>.
    // Заменяет символы CRLF перевода строк на html тэг <br>.
    const { blockFormatted, flatData } = formateAndStripContent({
      title,
      startLocation,
      turnLocation,
      finishLocation,
      distance,
      ascent,
      garminConnect,
      komoot,
      hashtags,
      blocks,
    });

    const formData = serializationTrailCreate({
      blocks: blockFormatted,
      title: flatData.title,
      region,
      difficultyLevel,
      startLocation: flatData.startLocation,
      turnLocation: flatData.turnLocation,
      finishLocation: flatData.finishLocation,
      distance: flatData.distance,
      ascent: flatData.ascent,
      garminConnect: flatData.garminConnect,
      komoot: flatData.komoot,
      hashtags: flatData.hashtags,
      poster,
      // urlSlug
      // posterOldUrl,
    });

    formData.forEach((elm) => console.log(elm));

    let response = {
      data: null,
      ok: false,
      message: 'Не передана ни функция обновления, ни создания новости!',
    };
    if (fetchTrailCreated) {
      response = await fetchTrailCreated(formData);
    } else if (fetchTrailEdited) {
      response = await fetchTrailEdited(formData);
    } else {
      return toast.error('Не передана ни функция обновления, ни создания новости!');
    }

    // if (response.ok) {
    //   setBlocks(getInitialBlocks());
    //   setTitle('');
    //   setSubTitle('');
    //   setHashtags('');
    //   setPoster(null);
    //   setResetData(true);
    //   setPosterUrl(null);
    //   toast.success(response.message);
    //   router.push(`/`);
    // } else {
    //   toast.error(response.message);
    // }
    setLoading(false);
  };

  // загрузка основного изображения

  return (
    <Wrapper title={'Форма ввода данных'} hSize={2}>
      <form onSubmit={onSubmit} className={cn(styles.form)}>
        {/* Блок ввода Названия */}
        <BoxInputSimple
          id="title"
          name="title"
          value={title}
          handlerInput={setTitle}
          type={'text'}
          label="Название:*"
          loading={isLoading}
          autoComplete={'off'}
          validationText={title.length > 3 && title.length < 20 ? '' : 'пустое!'}
        />

        {/* Блок ввода Региона */}
        <BoxSelectSimple
          state={region}
          setState={setRegion}
          name="state"
          options={regionsOptions}
          label="Регион:*"
          loading={isLoading}
          validationText={region ? '' : 'нет данных'}
        />

        {/* Блок ввода Сложности */}
        <BoxSelectSimple
          state={difficultyLevel}
          setState={setDifficultyLevel}
          name="difficultyLevel"
          options={difficultyLevelOptions}
          label="Сложность:*"
          loading={isLoading}
          validationText={difficultyLevel ? '' : 'нет данных'}
        />

        {/* Блок ввода Места старта */}
        <BoxInputSimple
          id="startLocation"
          name="startLocation"
          value={startLocation}
          handlerInput={setStartLocation}
          type={'text'}
          label="Место старта:*"
          loading={isLoading}
          autoComplete={'off'}
          validationText={
            startLocation.length > 2 && startLocation.length < 20 ? '' : 'ошибка!'
          } // !!! необходимо установить макс. количество символов.
        />

        {/* Блок ввода Места разворота */}
        <BoxInputSimple
          id="turnLocation"
          name="turnLocation"
          value={turnLocation}
          handlerInput={setTurnLocation}
          type={'text'}
          label="Место разворота:*"
          loading={isLoading}
          autoComplete={'off'}
          validationText={turnLocation.length > 2 && turnLocation.length < 20 ? '' : 'ошибка!'} // !!! необходимо установить макс. количество символов.
        />

        {/* Блок ввода Места финиша */}
        <BoxInputSimple
          id="finishLocation"
          name="finishLocation"
          value={finishLocation}
          handlerInput={setFinishLocation}
          type={'text'}
          label="Место финиша:*"
          loading={isLoading}
          autoComplete={'off'}
          validationText={
            finishLocation.length > 2 && finishLocation.length < 20 ? '' : 'ошибка!'
          } // !!! необходимо установить макс. количество символов.
        />

        {/* Блок ввода общей дистанции в метрах */}
        <BoxInputSimple
          id="distance"
          name="distance"
          value={distance}
          handlerInput={setDistance}
          type={'number'}
          label="Общая дистанция в метрах:*"
          loading={isLoading}
          autoComplete={'off'}
          validationText={distance > 100 ? '' : 'ошибка!'}
        />

        {/* Блок ввода общего набора в метрах */}
        <BoxInputSimple
          id="ascent"
          name="ascent"
          value={ascent}
          handlerInput={setAscent}
          type={'number'}
          label="Общий набор в метрах:*"
          loading={isLoading}
          autoComplete={'off'}
          validationText={ascent > 0 ? '' : 'ошибка!'}
        />

        {/* Ссылка на маршрут в Garmin Connect */}
        <BoxInputSimple
          id="garminConnect"
          name="garminConnect"
          value={garminConnect}
          handlerInput={setGarminConnect}
          type={'text'}
          label="Ссылка на маршрут в Garmin Connect:"
          loading={isLoading}
          autoComplete={'off'}
        />

        {/* Ссылка на маршрут в komoot */}
        <BoxInputSimple
          id="komoot"
          name="komoot"
          value={komoot}
          handlerInput={setKomoot}
          type={'text'}
          label="Ссылка на маршрут в Komoot:"
          loading={isLoading}
          autoComplete={'off'}
        />

        {/* Блок загрузки Главного изображения (обложки) */}
        <BlockUploadImage
          title={'Главное изображение (обложка):*'}
          poster={poster}
          setPoster={setPoster}
          resetData={resetData}
          posterUrl={posterUrl}
          setPosterUrl={setPosterUrl}
        />

        {/* Блок добавления текста и изображения новости */}
        {blocks.map((block) => (
          <div className={styles.block__info} key={block.position}>
            {/* <LineSeparator /> */}
            <BlockNewsTextAdd
              block={block}
              blocks={blocks}
              setBlocks={setBlocks}
              isLoading={isLoading}
            />
          </div>
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
