import cn from 'classnames';

import styles from './GapInProtocol.module.css';
import { GapTimeFormatter } from '@/libs/utils/gaptoseconds';

export default function TdGap({ gap, dsq }: { gap: number; dsq?: boolean }) {
  const gapTimeStr = GapTimeFormatter.getGapsInProtocol(gap);

  const gapHasMs = gapTimeStr ? gapTimeStr.includes('мс') : null;

  return (
    //  если имеется дисквалификация (dsq), то gap пустой
    !dsq && (
      <div className={cn(styles.gap, { [styles.gap__ms]: gapHasMs })}>
        {gapTimeStr ? <>{gapTimeStr}</> : ''}
      </div>
    )
  );
}
