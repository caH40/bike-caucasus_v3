import { TIconProps } from '@/types/index.interface';
import styles from './BlockInteractive.module.css';

type Props = {
  icons: {
    id: number;
    // eslint-disable-next-line no-unused-vars
    icon: ({ isActive, squareSize, getClick }: TIconProps) => JSX.Element;
    getClick: () => void;
    tooltip: string;
  }[];
};

/**
 * Интерактивный блок для модерации в таблицах модерации.
 */
export default function BlockInteractive({ icons }: Props) {
  return (
    <div className={styles.wrapper}>
      {icons.map((icon) => (
        <icon.icon
          getClick={icon.getClick}
          key={icon.id}
          squareSize={20}
          colors={{ hover: '#ec9c07' }}
          tooltip={icon.tooltip}
        />
      ))}
    </div>
  );
}
