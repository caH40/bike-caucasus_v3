'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import cn from 'classnames/bind';

import type { TMenuOnPage } from '@/types/index.interface';
import styles from './MenuOnPage.module.css';
import { handlerPosition } from '@/libs/utils/buttons';
import { usePathname, useRouter } from 'next/navigation';
import PermissionCheck from '@/hoc/permission-check';

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
      permission: null,
    },
  ]
    .filter((button) => button.id !== 100 || (button.id === 100 && needBack))
    .map((button) => {
      if (button.href && path === button.href && !button.classes.includes('active')) {
        // Выделение кнопки активной страницы.
        return { ...button, classes: [...button.classes, 'active'] };
      }
      return button;
    });

  return (
    <nav className={cx('wrapper')}>
      <ul className={styles.list}>
        {!!buttonList.length &&
          buttonList.map((button, index) => (
            <Fragment key={button.id}>
              {button.href ? (
                <PermissionCheck permission={button.permission}>
                  <li>
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
                  </li>
                </PermissionCheck>
              ) : (
                <li>
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
                </li>
              )}
            </Fragment>
          ))}
      </ul>
    </nav>
  );
}