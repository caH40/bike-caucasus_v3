import { Tooltip } from 'react-tooltip';

import styles from './Td.module.css';

// types
import { TDisqualification } from '@/types/models.interface';

type Props = { disqualification: TDisqualification; resultId: string };

/**
 * Отображение дисквалификации в таблицах результатов.
 */
export default function Disqualification({ disqualification, resultId }: Props): JSX.Element {
  return (
    <>
      <span
        data-tooltip-id={resultId}
        data-tooltip-content={disqualification.comment}
        className={styles.dsq}
      >
        {disqualification.type}
      </span>
      <Tooltip id={resultId} place="top" />
    </>
  );
}
