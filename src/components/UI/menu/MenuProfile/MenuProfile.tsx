'use client';

import Link from 'next/link';
import cn from 'classnames/bind';

import styles from './MenuProfile.module.css';
import { toast } from 'sonner';

const cx = cn.bind(styles);

/**
 * Меню на странице профиля
 */
export default function MenuProfile() {
  // сохранение ссылки в буфер обмена
  const shareUrl = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success('Ссылка на аккаунт скопирована в буфер обмена'));
  };

  // в разработке
  const onDev = () => toast.info('В разработке');

  return (
    <div className={cx('wrapper')}>
      <Link className={cx('btn', 'top')} href={'/account/profile'}>
        Настройки
      </Link>
      <hr className={cx('line')} />
      <button className={cx('btn')} onClick={onDev}>
        Разное
      </button>
      <hr className={cx('line')} />
      <button className={cx('btn', 'bottom')} onClick={shareUrl}>
        Поделиться ссылкой
      </button>
    </div>
  );
}
