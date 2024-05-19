'use client';

import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import cn from 'classnames/bind';

import type { TMenuOnPage } from '@/types/index.interface';
import styles from './MenuOnPage.module.css';
import { handlerPosition } from '@/libs/utils/buttons';
import { useRouter } from 'next/navigation';

const cx = cn.bind(styles);

type Props = {
  buttons: TMenuOnPage[];
  needBack?: boolean;
};

/**
 * Меню которое располагается на страницах с кнопками и линками
 */
export default function MenuOnPage({ buttons, needBack }: Props) {
  const router = useRouter();
  const [buttonList, setButtonList] = useState(() => {
    if (needBack) {
      return [
        ...buttons,
        {
          id: 100,
          name: 'Вернуться',
          classes: [],
          onClick: () => router.back(),
        },
      ];
    }
    return buttons;
  });

  useEffect(() => {
    if (needBack) {
      setButtonList((prevButtons) => {
        // Проверяем, добавлена ли уже кнопка "Вернуться"
        const backButtonExists = prevButtons.some((button) => button.id === 100);
        if (!backButtonExists) {
          return [
            ...prevButtons,
            {
              id: 100,
              name: 'Вернуться',
              classes: [],
              onClick: () => router.back(),
            },
          ];
        }
        return prevButtons;
      });
    }
  }, [needBack, router]);

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
