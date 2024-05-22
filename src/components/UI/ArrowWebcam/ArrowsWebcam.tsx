import { Dispatch, SetStateAction } from 'react';

import ArrowSvg from './ArrowSvg';
import styles from './ArrowsWebcam.module.css';

// Номера камер на сайтеgw.cmo.sai.msu.ru
const webcams = [1, 5, 6, 7];

type Params = {
  numberWebcam: number;
  setNumberWebcam: Dispatch<SetStateAction<number>>;
};

/**
 * Стрелки для переключения между вебкамерами.
 */
export default function ArrowsWebcam({ numberWebcam, setNumberWebcam }: Params) {
  const chooseNumber = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      if (webcams.indexOf(numberWebcam) === 0) {
        setNumberWebcam(webcams[webcams.length - 1]);
      } else {
        setNumberWebcam((prev) => webcams[webcams.indexOf(prev) - 1]);
      }
    }

    if (direction === 'right') {
      if (webcams.indexOf(numberWebcam) === webcams.length - 1) {
        setNumberWebcam(webcams[0]);
      } else {
        setNumberWebcam((prev) => webcams[webcams.indexOf(prev) + 1]);
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
