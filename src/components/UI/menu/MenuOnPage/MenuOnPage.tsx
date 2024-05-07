'use client';

import { Fragment } from 'react';
import cn from 'classnames/bind';

import styles from './MenuOnPage.module.css';
import Link from 'next/link';
import type { TMenuOnPage } from '@/types/index.interface';

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
              <Link className={cx(...button.classes)} href={button.href}>
                {button.name}
              </Link>
            ) : (
              <button
                key={button.id}
                className={cx(...button.classes)}
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
