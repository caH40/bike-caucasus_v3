'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import cn from 'classnames/bind';

import type { TMenuOnPage } from '@/types/index.interface';
import styles from './MenuOnPage.module.css';
import { handlerPosition } from '@/libs/utils/buttons';

const cx = cn.bind(styles);

/**
 * Меню которое располагается на страницах с кнопками и линками
 */
export default function MenuOnPage(buttons: TMenuOnPage[]) {
  return (
    <div className={cx('wrapper')}>
      {!!buttons.length &&
        buttons.map((button, index) => (
          <Fragment key={button.id}>
            {button.href ? (
              <Link
                className={cx('btn', handlerPosition(buttons.length, index))}
                href={button.href}
              >
                {button.name}
              </Link>
            ) : (
              <button
                key={button.id}
                className={cx('btn', handlerPosition(buttons.length, index))}
                onClick={button.onClick}
              >
                {button.name}
              </button>
            )}
            {buttons.length !== index + 1 && <hr className={cx('line')} />}
          </Fragment>
        ))}
    </div>
  );
}
