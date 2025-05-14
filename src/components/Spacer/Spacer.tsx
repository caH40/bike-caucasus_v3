import cn from 'classnames/bind';
import styles from './Spacer.module.css';

type Props = {
  children: React.ReactNode;
  margin: 't-sm' | 't-md' | 't-lg' | 'b-sm' | 'b-md' | 'b-lg';
};

const cx = cn.bind(styles);

/**
 * Компонент отступа сверху или снизу.
 * Используется для управления вертикальным пространством между элементами.
 * Поддерживаемые варианты:
 * - t-sm / t-md / t-lg — отступ сверху
 * - b-sm / b-md / b-lg — отступ снизу
 */
export default function Spacer({ children, margin }: Props) {
  return <div className={cx(margin)}>{children}</div>;
}
