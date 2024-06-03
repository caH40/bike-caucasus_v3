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
  const [hashtags, setHashtags] = useState<string>('');
  const [blocks, setBlocks] = useState<TBlockInputInfo[]>(() =>
    getInitialBlocks(trailForEdit?.blocks)
  );
  // Постер Маршрута в формате File.
  const [poster, setPoster] = useState<File | null>(null);
  // Постер Маршрута существует при редактировании, url на изображение.
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

    if (
      !(poster || posterUrl) ||
      !(title.length > 2 && title.length < 30) ||
      !(hashtags.length >= 3) ||
      !region ||
      !difficultyLevel ||
      !(startLocation.length > 2 && startLocation.length < 20) ||
      !(finishLocation.length > 2 && finishLocation.length < 20) ||
      !(distance > 100) ||
      !(ascent > 0) ||
      !(komoot ? (komoot.startsWith('https://www.komoot.com/') ? true : false) : true) ||
      !(garminConnect
        ? garminConnect.startsWith('https://connect.garmin.com/')
          ? true
          : false
        : true)
    ) {
      toast.error('Присутствуют ошибки в заполнении формы!');
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

    const messageErr = 'Не передана ни функция обновления, ни создания маршрута!';
    let response = {
      data: null,
      ok: false,
      message: messageErr,
    };
    if (fetchTrailCreated) {
      response = await fetchTrailCreated(formData);
    } else if (fetchTrailEdited) {
      response = await fetchTrailEdited(formData);
    } else {
      return toast.error(messageErr);
    }

    if (response.ok) {
      setBlocks(getInitialBlocks());
      setTitle('');
      setRegion('');
      setDifficultyLevel('');
      setStartLocation('');
      setTurnLocation('');
      setFinishLocation('');
      setDistance(0);
      setAscent(0);
      setGarminConnect('');
      setKomoot('');
      setHashtags('');
      setPoster(null);
      setResetData(true);
      setPosterUrl(null);
      toast.success(response.message);
      router.push(`/trails`);
    } else {
      toast.error(response.message);
    }
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
          showValidationText={true}
          validationText={title.length > 2 && title.length < 30 ? '' : 'от 3 до 30 символов!'}
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
          showValidationText={true}
          validationText={
            startLocation.length > 2 && startLocation.length < 20 ? '' : 'от 3 до 20 символов!'
          }
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
          showValidationText={true}
          validationText={''}
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
          showValidationText={true}
          validationText={
            finishLocation.length > 2 && finishLocation.length < 20
              ? ''
              : 'от 3 до 20 символов!'
          }
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
          showValidationText={true}
          validationText={
            garminConnect
              ? garminConnect.startsWith('https://connect.garmin.com/')
                ? ''
                : 'начало с https://connect.garmin.com/'
              : ''
          } // Необязательный, но если есть, то должен начинаться с https://connect.garmin.com/
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
          showValidationText={true}
          validationText={
            komoot
              ? komoot.startsWith('https://www.komoot.com/')
                ? ''
                : 'начало с https://www.komoot.com/'
              : ''
          } // Необязательный, но если есть, то должен начинаться с https://www.komoot.com
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

        {/* Блок добавления Хэштэгов */}
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

        {/* Блок добавления текста и изображения Маршрута */}
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

        <div className={styles.box__button}>
          <Button name="Опубликовать" theme="green" loading={isLoading} />
        </div>
      </form>
    </Wrapper>
  );
}
