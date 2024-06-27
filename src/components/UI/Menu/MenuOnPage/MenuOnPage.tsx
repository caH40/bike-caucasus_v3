'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import cn from 'classnames/bind';

import { handlerPosition } from '@/libs/utils/buttons';
import { usePathname, useRouter } from 'next/navigation';
import PermissionCheck from '@/hoc/permission-check';
import IconBack from '@/components/Icons/IconBack';
import type { TMenuOnPage } from '@/types/index.interface';
import styles from './MenuOnPage.module.css';

const cx = cn.bind(styles);

type Props = {
  buttons: TMenuOnPage[];
  buttonAdditional?: {
    name: string; // Название кнопки.
    path: string; // Путь адреса навигации.
  };
};

/**
 * Меню которое располагается на страницах с кнопками и линками.
 */
export default function MenuOnPage({ buttons, buttonAdditional }: Props) {
  const router = useRouter();
  const path = usePathname();

  // Дополнительная кнопка в меню, обычно возврат на определенный адрес (path)
  const buttonBack: TMenuOnPage = {
    id: 100,
    name: buttonAdditional?.name || 'Вернуться',
    classes: [],
    onClick: () => router.push(buttonAdditional?.path || '/'),
    permission: null,
    icon: IconBack,
  };

  // Меню с добавлением кнопки Вернуться назад.
  const buttonList = [...buttons, buttonBack]
    .filter((button) => button.id !== 100 || (button.id === 100 && buttonAdditional))
    .map((button) => {
      if (button.href && path.includes(button.href) && !button.classes.includes('active')) {
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
                      {button.icon ? (
                        <div className={styles.box__icon}>
                          <button.icon squareSize={22} />
                        </div>
                      ) : null}
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
                    {button.icon ? (
                      <div className={styles.box__icon}>
                        <button.icon squareSize={22} />
                      </div>
                    ) : null}
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
