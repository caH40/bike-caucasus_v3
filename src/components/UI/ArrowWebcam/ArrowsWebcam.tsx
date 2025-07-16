import { Dispatch, SetStateAction } from 'react';

import ArrowSvg from './ArrowSvg';
import styles from './ArrowsWebcam.module.css';

type Params = {
  webcamIndex: number;
  setWebcamIndex: Dispatch<SetStateAction<number>>;
  webcams: number[];
};

/**
 * Стрелки для переключения между вебкамерами.
 */
export default function ArrowsWebcam({ webcamIndex, setWebcamIndex, webcams }: Params) {
  const chooseNumber = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      if (webcamIndex === 0) {
        setWebcamIndex(webcams.length - 1);
      } else {
        setWebcamIndex((prev) => prev - 1);
      }
    }

    if (direction === 'right') {
      if (webcamIndex === webcams.length - 1) {
        setWebcamIndex(0);
      } else {
        setWebcamIndex((prev) => prev + 1);
      }
    }
  };

  return (
    <>
      <div className={`${styles.arrow} ${styles.left}`} onClick={() => chooseNumber('left')}>
        <ArrowSvg isLeftArrow={true} />
      </div>

      <div className={`${styles.arrow} ${styles.right}`} onClick={() => chooseNumber('right')}>
        <ArrowSvg />
      </div>
    </>
  );
}
