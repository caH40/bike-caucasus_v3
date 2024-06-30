import { TIconProps } from '@/types/index.interface';
import TitleAndLine from '../TitleAndLine/TitleAndLine';
import styles from './Wrapper.module.css';

type Props = {
  title: string;
  hSize?: 2 | 1 | 3 | 4 | 5 | 6; // Размера заголовка h, по умолчанию h1.
  children: React.ReactNode;
  Icon?: React.ComponentType<TIconProps>;
};

/**
 * Блок для формы
 */
export default function Wrapper({ title, hSize = 1, Icon, children }: Props) {
  return (
    <div className={styles.wrapper}>
      <TitleAndLine hSize={hSize} title={title} Icon={Icon} />
      <div className={styles.gaps}>{children}</div>
    </div>
  );
}
