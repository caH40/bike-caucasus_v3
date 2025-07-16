/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';

import { lcWebcamShadzhatmaz as lcName } from '@/constants/local-storage';
import ArrowsWebcam from '../UI/ArrowWebcam/ArrowsWebcam';
import styles from './Webcam.module.css';
import Pagination from '../UI/Pagination/Pagination';

type Props = {
  forFullScr?: boolean;
};
// const noImage = '/images/transparent800.png';

// Номера камер на сайтеgw.cmo.sai.msu.ru
const webcams = [1, 5, 6, 7, 8];

// eslint-disable-next-line no-unused-vars
export default function Webcam({ forFullScr }: Props) {
  const [webcamIndex, setWebcamIndex] = useState<number>(0);

  useEffect(() => {
    const initialWebcam = Number(localStorage.getItem(lcName) ?? 0);
    setWebcamIndex(initialWebcam);
  }, []);

  // Сохранение номера вебкамеры в Локальном хранилище.
  // Если numberWebcam=0, значит еще не получены данные инициализации из Локального хранилища.
  useEffect(() => {
    localStorage.setItem(lcName, String(webcamIndex));
  }, [webcamIndex]);

  return (
    <div className={styles.wrapper}>
      {!forFullScr && <h2 className={styles.title}>Вебкамеры на горе Шаджатмаз</h2>}

      <div className={styles.webcam}>
        <ArrowsWebcam
          webcamIndex={webcamIndex}
          setWebcamIndex={setWebcamIndex}
          webcams={webcams}
        />
        <div className={styles.box__img}>
          <img
            className={styles.img}
            src={`https://gw.cmo.sai.msu.ru/webcam${webcams[webcamIndex]}.jpg`}
            alt={`Вебкамера на горе Шаджатмаз webcam${webcams[webcamIndex]}`}
          />
        </div>
      </div>

      <Pagination
        quantityPages={webcams.length}
        page={webcamIndex}
        setPage={setWebcamIndex}
        isFirstPage={webcamIndex === 0}
        isLastPage={webcamIndex === webcams.length - 1}
      />
    </div>
  );
}
