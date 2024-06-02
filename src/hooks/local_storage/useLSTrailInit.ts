import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { lcSuffixTrailModeration as suffix } from '@/constants/local-storage';
import { TBlockInputInfo } from '@/types/index.interface';

type PropsInit = {
  setBlocks: Dispatch<SetStateAction<TBlockInputInfo[]>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setHashtags: Dispatch<SetStateAction<string>>;
  setRegion: Dispatch<SetStateAction<string>>;
  setDifficultyLevel: Dispatch<SetStateAction<string>>;
  setStartLocation: Dispatch<SetStateAction<string>>;
  setTurnLocation: Dispatch<SetStateAction<string>>;
  setFinishLocation: Dispatch<SetStateAction<string>>;
  setDistance: Dispatch<SetStateAction<number>>;
  setAscent: Dispatch<SetStateAction<number>>;
  setGarminConnect: Dispatch<SetStateAction<string>>;
  setKomoot: Dispatch<SetStateAction<string>>;
  initialBlocks: TBlockInputInfo[];
  isEditing: boolean; // Происходит редактирование или создание маршрута.
  target: 'edit' | 'create'; // указывает какая форма используется.
};

/**
 * Хук инициализирует данные в форме создания Маршрута (trail) из Локального хранилища.
 */
export function useLSTrailInit({
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
  isEditing,
  initialBlocks,
  target,
}: PropsInit): void {
  useEffect(() => {
    // Получение данных с Локального хранилища браузера.
    if (isEditing) {
      setBlocks(initialBlocks);
      // Не использовать Локальное хранилище при редактировании новости,
      // так как формы новости заполняются из БД.
      return;
    } else {
      const blocksLS = localStorage.getItem(`${suffix}${target}-blocks`);
      const blockParsed = blocksLS && JSON.parse(blocksLS);
      // проверка, что blockParsed существует и является массивом в нулевом элементе которого
      // есть свойство position, иначе возвращается initialBlocks
      const initBlocks = blockParsed && blockParsed[0].position ? blockParsed : initialBlocks;
      setBlocks(initBlocks);
    }

    const initTitle = localStorage.getItem(`${suffix}${target}-title`) || '';
    const initRegion = localStorage.getItem(`${suffix}${target}-region`) || 'stavropolKrai';
    const initDifficultyLevel =
      localStorage.getItem(`${suffix}${target}-difficultyLevel`) || 'easy';
    const initStartLocation = localStorage.getItem(`${suffix}${target}-startLocation`) || '';
    const initTurnLocation = localStorage.getItem(`${suffix}${target}-turnLocation`) || '';
    const initFinishLocation = localStorage.getItem(`${suffix}${target}-finishLocation`) || '';
    const initDistance = +(localStorage.getItem(`${suffix}${target}-distance`) || 0);
    const initAscent = +(localStorage.getItem(`${suffix}${target}-ascent`) || 0);
    const initGarminConnect = localStorage.getItem(`${suffix}${target}-garminConnect`) || '';
    const initKomoot = localStorage.getItem(`${suffix}${target}-komoot`) || '';
    const initHashtags = localStorage.getItem(`${suffix}${target}-hashtags`) || '';

    setTitle(initTitle);
    setRegion(initRegion);
    setDifficultyLevel(initDifficultyLevel);
    setStartLocation(initStartLocation);
    setTurnLocation(initTurnLocation);
    setFinishLocation(initFinishLocation);
    setDistance(initDistance);
    setAscent(initAscent);
    setGarminConnect(initGarminConnect);
    setKomoot(initKomoot);
    setHashtags(initHashtags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
