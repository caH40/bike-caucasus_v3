'use client';

import Image from 'next/image';
import { useState } from 'react';

import ArrowsWebcam from '../UI/ArrowWebcam/ArrowsWebcam';
import styles from './Webcam.module.css';

export default function Webcam() {
  const [numberWebcam, setNumberWebcam] = useState(1);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Вебкамеры на горе Шаджатмаз</h2>

      <div className={styles.webcam}>
        <ArrowsWebcam numberWebcam={numberWebcam} setNumberWebcam={setNumberWebcam} />
        <div className={styles.box__img}>
          <Image
            className={styles.img}
            src={`https://gw.cmo.sai.msu.ru/webcam${numberWebcam}.jpg`}
            alt={`Вебкамера на горе Шаджатмаз webcam${numberWebcam}`}
            fill={true}
            sizes="(max-width: 992px) 100vw, 33vw"
          />
        </div>
      </div>
    </div>
  );
}
