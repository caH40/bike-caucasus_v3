'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import cn from 'classnames/bind';

import type { TMenuOnPage } from '@/types/index.interface';
import styles from './MenuOnPage.module.css';
import { handlerPosition } from '@/libs/utils/buttons';
import { usePathname, useRouter } from 'next/navigation';

const cx = cn.bind(styles);

type Props = {
  buttons: TMenuOnPage[];
  needBack?: boolean;
};

/**
 * Меню которое располагается на страницах с кнопками и линками.
 */
export default function MenuOnPage({ buttons, needBack }: Props) {
  const router = useRouter();
  const path = usePathname();

  // Меню с добавлением кнопки Вернуться назад.
  const buttonList = [
    ...buttons,
    {
      id: 100,
      name: 'Вернуться',
      classes: [],
      onClick: () => router.back(),
    },
  ]
    .filter((button) => button.id !== 100 || (button.id === 100 && needBack))
    .map((button) => {
      // Выделение кнопки активной страницы.
      if (path === button.href && !button.classes.includes('active')) {
        return { ...button, classes: [...button.classes, 'active'] };
      }
      return button;
    });

  return (
    <div className={cx('wrapper')}>
      {!!buttonList.length &&
        buttonList.map((button, index) => (
          <Fragment key={button.id}>
            {button.href ? (
              <Link
                className={cx(
                  'btn',
                  handlerPosition(buttonList.length, index),
                  ...button.classes
                )}
                href={button.href}
              >
                {button.name}
              </Link>
            ) : (
              <button
                className={cx(
                  'btn',
                  handlerPosition(buttonList.length, index),
                  ...button.classes
                )}
                onClick={button.onClick}
              >
                {button.name}
              </button>
            )}
            {buttonList.length !== index + 1 && <hr className={cx('line')} />}
          </Fragment>
        ))}
    </div>
  );
}
