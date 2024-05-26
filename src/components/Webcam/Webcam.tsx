/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';

import { lcWebcamShadzhatmaz as lcName } from '@/constants/local-storage';
import ArrowsWebcam from '../UI/ArrowWebcam/ArrowsWebcam';
// import noImage from '../../../public/images/transparent800.png';
import styles from './Webcam.module.css';

type Props = {
  forFullScr?: boolean;
};
const noImage = '/images/transparent800.png';

// eslint-disable-next-line no-unused-vars
export default function Webcam({ forFullScr }: Props) {
  const [numberWebcam, setNumberWebcam] = useState<number>(0);

  useEffect(() => {
    const initialWebcam = Number(localStorage.getItem(lcName) ?? 1);
    setNumberWebcam(initialWebcam);
  }, []);

  // Сохранение номера вебкамеры в Локальном хранилище.
  // Если numberWebcam=0, значит еще не получены данные инициализации из Локального хранилища.
  useEffect(() => {
    if (!numberWebcam) {
      return;
    }
    localStorage.setItem(lcName, String(numberWebcam));
  }, [numberWebcam]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Вебкамеры на горе Шаджатмаз</h2>

      <div className={styles.webcam}>
        <ArrowsWebcam numberWebcam={numberWebcam} setNumberWebcam={setNumberWebcam} />
        <div className={styles.box__img}>
          <img
            className={styles.img}
            src={numberWebcam ? `https://gw.cmo.sai.msu.ru/webcam${numberWebcam}.jpg` : noImage}
            alt={`Вебкамера на горе Шаджатмаз webcam${numberWebcam}`}
            // fill={true}
            // sizes={forFullScr ? '90vw' : '(max-width: 992px) 100vw, 33vw'}
            // priority={forFullScr}
          />
        </div>
      </div>
    </div>
  );
}
